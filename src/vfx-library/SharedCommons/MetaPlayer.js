import { BoxBufferGeometry, Mesh, Object3D, Vector3 } from 'three'
import { AvatarNPCSKin } from './AvatarNPCSKin'
import { loadGLTF } from './AvatarSkin'
import { Chaser } from './Chaser'
import { Companion } from './Companion'

export class MetaPlayer {
  constructor({ fireAPI, api, scene, collider, self, uid, mapID }) {
    //

    let { analytics, auth, app, db, FDB, getUser, loginGuest } = fireAPI
    let { ref, set, get, onValue, remove, onDisconnect } = FDB

    let destination = new Object3D()

    let chaser = new Chaser({
      name: 'Chaser Core',
      chaseTarget: destination,
      api,
      visible: true,
      Settings: self.params,
      collider: collider,
      scene,
    })

    this.clean = () => {
      //
      chaser.sub.clean()
    }

    let companion = new Companion({ api, parent: self, chase: destination })

    let myPositionRef = ref(db, `rooms/${mapID}/${uid}`)

    let cleanUser = () => {}
    let lastURL = ''

    chaser.sub.onClean(() => {
      cleanUser()
    })

    let displayAvatar = (url) => {
      if (lastURL !== url) {
        lastURL = url
        cleanUser()
        let avatar = new AvatarNPCSKin({
          scene,
          chaser,
          avatarURL: url,
        })
        cleanUser = () => {
          avatar.clean()
          companion.clean()
        }
      }
    }

    // onValue(refUserProfile, async (snap) => {
    //   let me = snap.exportVal();

    //   if (me && me.avatarURL) {
    //     api.now.myAvatarURL = me.avatarURL;
    //   } else {
    //     api.now.myAvatarURL = "";
    //   }
    // });

    let refUserProfile = ref(db, `profiles/${uid}`)
    let cleanAva = onValue(refUserProfile, (snap) => {
      if (snap) {
        let val = snap.val()
        if (val) {
          if (val.avatarURL) {
            displayAvatar(val.avatarURL)
          } else {
            displayAvatar(
              `${window.location.origin}${self.params.defaultAvatar}`
            )
          }
        } else {
        }
      } else {
      }
    })

    chaser.sub.onClean(() => {
      cleanAva()
    })

    // chaser

    let downloadRef = ref(db, `rooms/${mapID}/${uid}`)
    chaser.player.userData.first = true
    let cleanDownload = onValue(downloadRef, (snap) => {
      if (snap) {
        let data = snap.val()

        if (data && data.avatarAt) {
          data.avatarAt[0] = data.avatarAt[0] || 0
          data.avatarAt[1] = data.avatarAt[1] || 0
          data.avatarAt[2] = data.avatarAt[2] || 0
          destination.position.fromArray(data.avatarAt)

          if (chaser.player.userData.first) {
            chaser.player.position.fromArray(data.avatarAt)
          }
        }
      }
    })

    chaser.sub.onClean(() => {
      cleanDownload()
    })

    // api.ready.scene.then((scene) => {
    //   scene.add(walker);
    //   api.onClean(() => {
    //     scene.remove(walker);
    //   });
    // });

    // let tCount = 0;
    // chaser.sub.onLoop(() => {
    //   // if (walker.position.distanceTo(destination) >= 3) {
    //   //   tCount++;
    //   // }
    //   // if (tCount >= 60 * 3) {
    //   //   tCount = 0;
    //   //   walker.position.copy(destination.position);
    //   // }
    // });

    //
  }
}
