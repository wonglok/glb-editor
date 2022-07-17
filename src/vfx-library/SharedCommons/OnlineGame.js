import { Core } from '@/vfx-core/Core'
import { createPortal } from '@react-three/fiber'
import md5 from 'md5'
// import { useEffect } from "react";
// import { Scene } from "three";
import { getFirebaseAPI } from './Firebase'
import { MetaPlayer } from './MetaPlayer'

export class OnlineGame {
  constructor({ mapURL = '', config, api, player, Settings, self }) {
    let fireAPI = getFirebaseAPI({ config })

    let setup = async () => {
      let mapID = md5(mapURL) //;

      let {
        auth,
        db,
        FDB,
        loginGuest,
        onAuthStateChanged,
        analytics,
        app,
        getUser,
      } = fireAPI
      let { ref, set, get, onValue, remove, onDisconnect } = FDB

      let user = await new Promise((resolve, reject) => {
        let clean = onAuthStateChanged(auth, async (userRes) => {
          if (userRes) {
            // const uid = userRes.uid;
            resolve(userRes)
            clean()
          } else {
            // resolve(null)
            // loginGuest().then(
            //   (userRes) => {
            //     resolve(userRes)
            //     clean()
            //   },
            //   () => {
            //     resolve(null)
            //     clean()
            //   }
            // )
          }
        })
      })

      // let user = null

      if (user === null) {
        api.now.myAvatarURL = ''

        let defaultUID = `_gest_${Math.floor(Math.random() * 100000000000)}`

        let lastRandomID = false
        try {
          lastRandomID = localStorage.getItem('randomID')

          if (lastRandomID === null || lastRandomID === '') {
            lastRandomID = defaultUID
            localStorage.setItem('randomID', defaultUID)
          }
        } catch (e) {
          console.log(e)
          lastRandomID = defaultUID
        }

        let uid = `${lastRandomID}`

        user = {
          uid,
          isAnonymous: true,
          displayName: 'Incognito Guest',
        }
      }

      let refOnlineMapKey = ref(db, `online/${mapID}`)
      let refOnlineMe = ref(db, `online/${mapID}/${user.uid}`)
      let refUserProfile = ref(db, `profiles/${user.uid}`)
      let myPositionRef = ref(db, `rooms/${mapID}/${user.uid}`)

      get(myPositionRef).then((snap) => {
        if (snap) {
          let val = snap.val()
          if (val) {
            self.resetPlayer({
              position: [
                0 + val.avatarAt[0] || 0,
                2 + (val.avatarAt[1] || 0),
                0 + val.avatarAt[2] || 0,
              ],
            })
          } else {
            // api.now.myAvatarURL = "";
          }
        } else {
          // api.now.myAvatarURL = "";
        }
      })

      let snap = await get(refUserProfile)
      let myself = snap.exportVal()

      if (myself === null) {
        set(refUserProfile, {
          //
          uid: user.uid,
          name: user.isAnonymous
            ? 'Guest ' + Math.floor(Math.random() * 10000000)
            : user.displayName,

          avatarURL: api.now.myAvatarURL || '',
        })

        let snap = await get(refUserProfile)
        myself = snap.exportVal()
      }

      if (myself && myself.avatarURL) {
        api.now.myAvatarURL = myself.avatarURL
      } else {
        api.now.myAvatarURL = ''
      }

      let lastMyAvatarURL = ''
      setInterval(() => {
        //
        if (myself) {
          if (api.now.myAvatarURL !== lastMyAvatarURL) {
            lastMyAvatarURL = api.now.myAvatarURL

            myself.avatarURL = api.now.myAvatarURL
            set(refUserProfile, myself)
          }
        }
      })

      onValue(refUserProfile, async (snap) => {
        let me = snap.exportVal()

        if (me && me.avatarURL) {
          api.now.myAvatarURL = me.avatarURL
        } else {
          api.now.myAvatarURL = ''
        }
      })

      set(refOnlineMe, true)
      onDisconnect(refOnlineMe).remove()

      // slef emitter
      let lastSig = ''
      let tt = setInterval(async () => {
        let newItem = {
          // avatarURL: api.now.myAvatarURL || "",
          avatarAt: self.state.player.position
            .toArray()
            .map((e) => Number(e.toFixed(3))),
        }

        let sig = JSON.stringify(newItem)
        if (sig !== lastSig) {
          lastSig = sig

          let mydetail = ref(db, `rooms/${mapID}/${user.uid}`)

          await set(mydetail, newItem)
          console.log(
            '[sync-up-user-player]',
            'uid',
            JSON.stringify(newItem, null, '')
          )
        }
      }, 1000)

      api.onClean(() => {
        clearInterval(tt)
      })

      //

      let map = new Map()
      let needsSync = (userKeys) => {
        console.log(userKeys)

        let getFilteredOnlineUser = () => userKeys.filter((k) => k !== user.uid)

        getFilteredOnlineUser().map(async (uKey) => {
          if (!map.has(uKey)) {
            //
            let metaplayer = new MetaPlayer({
              api,
              self,
              uid: uKey,
              mapID,
              fireAPI,
              collider: await api.ready.collider,
              scene: await api.ready.scene,
            })

            map.set(uKey, metaplayer)
          }
        })

        for (let [key, val] of map.entries()) {
          console.log(key)
          if (!getFilteredOnlineUser().includes(key)) {
            val.clean()
            map.delete(key)
          }
        }
      }

      let cleanOnlineKeyList = onValue(refOnlineMapKey, async (snap) => {
        let newUserKeys = []
        if (snap) {
          let val = (await snap.exportVal()) || {}

          for (let kn in val) {
            newUserKeys.push(kn)
          }
          needsSync(newUserKeys)
        } else {
          newUserKeys = []
          needsSync(newUserKeys)
        }
      })

      api.onClean(() => {
        cleanOnlineKeyList()
      })

      window.addEventListener('focus', () => {
        set(refOnlineMe, true)
        onDisconnect(refOnlineMe).remove()
      })
    }

    this.done = setup().catch(console.log)
  }
}

if (module.hot) {
  module.hot.dispose(() => {
    window.dispatchEvent(new CustomEvent('reload'))
  })
}

///
