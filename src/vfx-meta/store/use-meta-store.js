import { ref } from 'firebase-v9/database'
import md5 from 'md5'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import create from 'zustand'
import { makeAvatarCTX } from '../ctx/make-avatar-ctx'
import { exportGLB } from './export-glb'
import { firebase } from './firebase'
import { sceneToCollider } from './scene-to-bvh'

export const useMetaStore = create((set, get) => {
  // return

  let myCTX = makeAvatarCTX()
  return {
    myCTX,

    //
    mode: 'ready',
    setMode: (mode) => {
      //
      set({ mode })
    },

    //
    myself: false,
    setMyself: (user) => {
      //
      set({ myself: user })
    },
    players: [],

    goOnline: (myself, seed) => {
      //
      let mapID = md5(seed)

      let db = firebase.database()
      let entireMapData = db.ref(`/meta/mapOnline/${mapID}`)
      let userData = db.ref(`/meta/mapOnline/${mapID}/${myself.uid}`)

      let hhSync = (snap) => {
        let val = snap && snap.val()
        let arr = []

        if (val) {
          for (let kn in val) {
            let value = val[kn]
            let key = kn

            //
            arr.push({
              uid: key,
              ...(value || {}),
            })
          }
        }

        //
        arr = arr.filter((a) => a.uid !== myself.uid)

        set({ players: arr })

        console.log(arr)

        // console.log(val)
      }
      // OtherOnePlayer
      entireMapData.on('value', hhSync)
      let offSnyc = () => {
        entireMapData.off('value', hhSync)
      }

      let check = () => get().myCTX.player.position.toArray().join('-')
      let prepare = () => {
        let {
          avatarURL,
          avatarVendor,

          //
          avatarURLWrap,

          avatarActionResumeOnKeyUp,
          avatarActionName,
          avatarActionIdleName,
          avatarActionRepeat,
        } = get().myCTX

        if (avatarActionRepeat === Infinity) {
          avatarActionRepeat = 'Infinity'
        }
        return {
          uid: myself.uid,

          //
          avatarURL,
          avatarVendor,

          //
          avatarURLWrap,

          avatarActionResumeOnKeyUp,
          avatarActionName,
          avatarActionIdleName,
          avatarActionRepeat,
          //

          playerPosition: get().myCTX.player.position.toArray(),
        }
      }

      let last = ''
      let tt = setInterval(() => {
        let latest = check()
        if (latest !== last) {
          last = latest
          userData.set({
            ...prepare(),
          })
        }
      }, 500)

      userData.onDisconnect().remove()

      console.log(myself)

      return () => {
        clearInterval(tt)
        //
        userData.remove()
        offSnyc()
        //
        //
      }
    },
    getLoginUser: (playerID) => {
      //
      let { players } = get()
      let idx = players.findIndex((e) => e._id === playerID)
      return players[idx] || null
    },

    //
    // addLoginUser: (player) => {
    //   let { players } = get()
    //   players.push(player)
    //   set({ players })
    // },
    // //
    // removeLoginUserID: (playerID) => {
    //   let { players } = get()
    //   let idx = players.findIndex((e) => e._id === playerID)
    //   //
    //   if (idx !== -1) {
    //     players.splice(idx, 1)
    //     set({ players: [...players] })
    //   } else {
    //     console.log('not found')
    //   }
    // },

    //
    loader: 'ready',
    setStartLoading: () => {
      set({ loader: 'loading' })
    },
    setDoneLoading: () => {
      set({ loader: 'ready' })
    },
    //
    otherAvatars: [],
    collider: false,
    setColliderFromScene: ({ scene }) => {
      sceneToCollider({ scene }).then((collider) => {
        set({ collider })
      })
    },

    controls: false,
    camera: false,

    setControls: ({ camera, dom }) => {
      let self = get()

      if (self.controls) {
        self.controls.dispose()
      }

      let controls = new OrbitControls(camera, dom)

      camera.near = 0.05
      camera.far = 500
      camera.updateProjectionMatrix()

      set({ controls, camera })

      get().setPosition({})

      return () => {
        controls.dispose()
      }
    },

    setPosition: ({ initPos = [0, 5, 0], cameraOffset = [0, 0, 5] }) => {
      let controls = get().controls
      let camera = get().camera
      myCTX.setPositionByArray(initPos)
      camera.position.copy(myCTX.player.position)
      camera.position.x += cameraOffset[0]
      camera.position.y += cameraOffset[1]
      camera.position.z += cameraOffset[2]
      controls.update()
    },

    setAction: (v, repeats = Infinity, restoreAction) => {
      myCTX.avatarActionName = v

      if (restoreAction) {
        myCTX.avatarActionResumeOnKeyUp = restoreAction
      }

      if (typeof repeats !== undefined) {
        myCTX.avatarActionRepeat = repeats
      }

      //
      set({ myCTX: myCTX })
    },

    goFowradDown: () => {
      myCTX.fwdPressed = true
      get().setAction('front', Infinity)
    },
    goFowradUp: () => {
      myCTX.fwdPressed = false
      if (myCTX.avatarActionRepeat === Infinity) {
        get().setAction(myCTX.avatarActionResumeOnKeyUp, Infinity)
      }
    },
    setKeyboard: () => {
      let setAction = get().setAction

      let onKeyDown = (e) => {
        switch (e.code) {
          case 'KeyX':
            if (myCTX.avatarActionResumeOnKeyUp === 'fightready') {
              setAction('stand', 1, 'stand')
            } else {
              setAction('fightready', 1, 'fightready')
            }
            break
          case 'KeyF':
            setAction('sidekick', 1)
            break
          case 'KeyV':
            setAction('warmup', 1)
            break
          case 'KeyR':
            setAction('backflip', 1)
            break
          case 'KeyW':
            myCTX.fwdPressed = true
            setAction('front', Infinity)
            break
          case 'KeyS':
            myCTX.bkdPressed = true
            setAction('back', Infinity)
            break
          case 'KeyD':
            myCTX.rgtPressed = true
            setAction('right', Infinity)
            break
          case 'KeyA':
            myCTX.lftPressed = true
            setAction('left', Infinity)
            break
          case 'KeyE':
            myCTX.rgtRotPressed = true
            break
          case 'KeyQ':
            myCTX.lftRotPressed = true
            break
          case 'ArrowUp':
            myCTX.fwdPressed = true
            setAction('running', Infinity)
            break
          case 'ArrowDown':
            myCTX.bkdPressed = true
            setAction('running', Infinity)
            break
          case 'ArrowRight':
            myCTX.rgtPressed = true
            setAction('running', Infinity)
            break
          case 'ArrowLeft':
            myCTX.lftPressed = true
            setAction('running', Infinity)
            break
          case 'Space':
            if (myCTX.playerIsOnGround) {
              myCTX.playerVelocity.y = 10.0
              setAction('jump', Infinity)
            }
            break
        }
      }

      //KeyboardControls
      window.addEventListener('keydown', onKeyDown)
      // this.parent.core.onClean(() => {
      //   window.removeEventListener('keydown', onKeyDown)
      // })

      let onKeyUp = (e) => {
        // if (!myCTX.xPressed) {
        //   // Core.now.drunkMode = false
        //   setAction('stand')
        // }

        switch (e.code) {
          case 'KeyW':
            myCTX.fwdPressed = false
          case 'KeyS':
            myCTX.bkdPressed = false
          case 'KeyD':
            myCTX.rgtPressed = false
          case 'KeyA':
            myCTX.lftPressed = false
          case 'KeyE':
            myCTX.rgtRotPressed = false
          case 'KeyQ':
            myCTX.lftRotPressed = false
          case 'ArrowUp':
            myCTX.fwdPressed = false
          case 'ArrowDown':
            myCTX.bkdPressed = false
          case 'ArrowRight':
            myCTX.rgtPressed = false
          case 'ArrowLeft':
            myCTX.lftPressed = false
          case 'Space':

          case 'KeyX':
            myCTX.xPressed = false
        }

        if (myCTX.avatarActionRepeat === Infinity) {
          setAction(myCTX.avatarActionResumeOnKeyUp, Infinity)
        }
      }

      window.addEventListener('focus', onKeyUp)
      // this.parent.core.onClean(() => {
      //   window.removeEventListener('focus', onKeyUp)
      // })

      window.addEventListener('blur', onKeyUp)
      // this.parent.core.onClean(() => {
      //   window.removeEventListener('blur', onKeyUp)
      // })

      window.addEventListener('keyup', onKeyUp)
      // this.parent.core.onClean(() => {
      //   window.removeEventListener('keyup', onKeyUp)
      // })

      return () => {
        window.removeEventListener('keydown', onKeyDown)
        window.removeEventListener('focus', onKeyUp)
        window.removeEventListener('blur', onKeyUp)
        window.removeEventListener('keyup', onKeyUp)
      }
    },

    clips: [],
    mixer: false,
    group: false,
    setExporter: (v) => {
      set({
        //
        group: v.group,
        clips: v.clips,
        mixer: v.mixer,
      })
    },
    exportAvatar: () => {
      let ttt = setInterval(() => {
        let { clips, group, mixer, setAction } = get()

        if (group) {
          clearInterval(ttt)
          group.traverse(console.log)

          exportGLB({
            clips,
            group,
            mixer,
            onDone: () => {
              setAction('backflip', 1)
            },
          })
        }
      })
    },

    setAvatar: ({
      vendor,
      avatarURL,
      avatarPartUpper,
      avatarPartLower,
      avatarPartShoes,
    }) => {
      //
      if (vendor === 'rpm') {
        myCTX.avatarVendor = 'rpm'
        myCTX.avatarURL = avatarURL
        set({ myCTX })
      }
      if (vendor === 'closet') {
        myCTX.avatarVendor = 'closet'

        myCTX.avatarPartUpper = avatarPartUpper || myCTX.avatarPartUpper
        myCTX.avatarPartLower = avatarPartLower || myCTX.avatarPartLower
        myCTX.avatarPartShoes = avatarPartShoes || myCTX.avatarPartShoes

        set({ myCTX: myCTX })
      }
      //
      if (vendor === 'temp') {
        myCTX.avatarVendor = 'temp'
        myCTX.avatarURLWrap = avatarURL

        set({ myCTX: myCTX })
      }
    },

    updatePlayer: (delta) => {
      if (delta > 1 / 60) {
        delta = 1 / 60
      }

      let self = get()
      // console.log(self)

      if (!self.collider) {
        return
      }
      if (!self.controls) {
        return
      }
      if (!self.camera) {
        return
      }

      myCTX.playerVelocity.y += myCTX.playerIsOnGround
        ? 0
        : delta * myCTX.gravity
      myCTX.player.position.addScaledVector(myCTX.playerVelocity, delta)

      // move the player
      const angle = self.controls.getAzimuthalAngle()
      if (myCTX.fwdPressed) {
        myCTX.tempVector.set(0, 0, -1).applyAxisAngle(myCTX.upVector, angle)
        myCTX.player.position.addScaledVector(
          myCTX.tempVector,
          myCTX.playerSpeed * delta
        )
        myCTX.player.rotation.y = self.controls.getAzimuthalAngle()
      }

      if (myCTX.bkdPressed) {
        myCTX.tempVector.set(0, 0, 1).applyAxisAngle(myCTX.upVector, angle)
        myCTX.player.position.addScaledVector(
          myCTX.tempVector,
          myCTX.playerSpeed * delta
        )
        myCTX.player.rotation.y = self.controls.getAzimuthalAngle()
      }

      if (myCTX.lftPressed) {
        myCTX.tempVector.set(-1, 0, 0).applyAxisAngle(myCTX.upVector, angle)
        myCTX.player.position.addScaledVector(
          myCTX.tempVector,
          myCTX.playerSpeed * delta
        )
        myCTX.player.rotation.y = self.controls.getAzimuthalAngle()
      }
      if (myCTX.rgtPressed) {
        myCTX.tempVector.set(1, 0, 0).applyAxisAngle(myCTX.upVector, angle)
        myCTX.player.position.addScaledVector(
          myCTX.tempVector,
          myCTX.playerSpeed * delta
        )
        myCTX.player.rotation.y = self.controls.getAzimuthalAngle()
      }

      if (myCTX.lftRotPressed) {
        myCTX.tempVector
          .set(1, 0, 0)
          .applyQuaternion(self.controls.object.quaternion)

        myCTX.quaternion.setFromAxisAngle(myCTX.tempVector, 0.1)
        self.controls.object.quaternion.premultiply(myCTX.quaternion)
        myCTX.tempVector.applyQuaternion(myCTX.quaternion)
        self.controls.object.position.addScaledVector(
          myCTX.tempVector,
          myCTX.coord
            .copy(self.camera.position)
            .sub(self.controls.target)
            .length() * 0.03
        )
        self.controls.saveState()
        self.controls.update()
        myCTX.player.rotation.y = self.controls.getAzimuthalAngle()
      }

      if (myCTX.rgtRotPressed) {
        myCTX.tempVector
          .set(-1, 0, 0)
          .applyQuaternion(self.controls.object.quaternion)

        myCTX.quaternion.setFromAxisAngle(myCTX.tempVector, 0.1)
        self.controls.object.quaternion.premultiply(myCTX.quaternion)
        myCTX.tempVector.applyQuaternion(myCTX.quaternion)
        self.controls.object.position.addScaledVector(
          myCTX.tempVector,
          myCTX.coord
            .copy(self.camera.position)
            .sub(self.controls.target)
            .length() * 0.03
        )
        self.controls.saveState()
        self.controls.update()
        myCTX.player.rotation.y = self.controls.getAzimuthalAngle()
      }

      myCTX.player.updateMatrixWorld()

      // adjust player position based on collisions
      const capsuleInfo = myCTX.player.capsuleInfo
      myCTX.tempBox.makeEmpty()
      myCTX.tempMat.copy(self.collider.matrixWorld).invert()
      myCTX.tempSegment.copy(capsuleInfo.segment)

      // get the position of the capsule in the local space of the collider
      myCTX.tempSegment.start
        .applyMatrix4(myCTX.player.matrixWorld)
        .applyMatrix4(myCTX.tempMat)
      myCTX.tempSegment.end
        .applyMatrix4(myCTX.player.matrixWorld)
        .applyMatrix4(myCTX.tempMat)

      // get the axis aligned bounding box of the capsule
      myCTX.tempBox.expandByPoint(myCTX.tempSegment.start)
      myCTX.tempBox.expandByPoint(myCTX.tempSegment.end)

      myCTX.tempBox.min.addScalar(-capsuleInfo.radius)
      myCTX.tempBox.max.addScalar(capsuleInfo.radius)

      self.collider.geometry.boundsTree.shapecast({
        intersectsBounds: (box) => box.intersectsBox(myCTX.tempBox),

        intersectsTriangle: (tri) => {
          // check if the triangle is intersecting the capsule and adjust the
          // capsule position if it is.
          const triPoint = myCTX.tempVector
          const capsulePoint = myCTX.tempVector2

          const distance = tri.closestPointToSegment(
            myCTX.tempSegment,
            triPoint,
            capsulePoint
          )
          if (distance < capsuleInfo.radius) {
            const depth = capsuleInfo.radius - distance
            const direction = capsulePoint.sub(triPoint).normalize()

            myCTX.tempSegment.start.addScaledVector(direction, depth)
            myCTX.tempSegment.end.addScaledVector(direction, depth)
          }
        },
      })

      // get the adjusted position of the capsule collider in world space after checking
      // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
      // the origin of the player model.
      const newPosition = myCTX.tempVector
      newPosition
        .copy(myCTX.tempSegment.start)
        .applyMatrix4(self.collider.matrixWorld)

      // check how much the collider was moved
      const deltaVector = myCTX.tempVector2
      deltaVector.subVectors(newPosition, myCTX.player.position)

      // if the player was primarily adjusted vertically we assume it's on something we should consider ground
      myCTX.playerIsOnGround =
        deltaVector.y > Math.abs(delta * myCTX.playerVelocity.y * 0.25)

      const offset = Math.max(0.0, deltaVector.length() - 1e-5)
      deltaVector.normalize().multiplyScalar(offset)

      // adjust the player model
      myCTX.player.position.add(deltaVector)

      if (!myCTX.playerIsOnGround) {
        deltaVector.normalize()
        myCTX.playerVelocity.addScaledVector(
          deltaVector,
          -deltaVector.dot(myCTX.playerVelocity)
        )
      } else {
        myCTX.playerVelocity.set(0, 0, 0)
      }

      // adjust the camera
      self.camera.position.sub(self.controls.target)
      self.controls.target.copy(myCTX.player.position)
      self.camera.position.add(myCTX.player.position)

      // if the player has fallen too far below the level reset their position to the start
      if (myCTX.player.position.y < -100) {
        // self.myCTX.player.position.copy({
        //   lookAtTarget: [3.3, 1.5, 32.1],
        //   cameraPositionOffset: [0, 1, 4],
        // })
        self.myCTX.player.position.fromArray([0, 5, 0])
        self.myCTX.playerVelocity.set(0, 0, 0)

        // this.reset({ position: [0, 3, 3], lookAtTarget: [0, 3, 3] })
      }
    },

    //
  }
})
