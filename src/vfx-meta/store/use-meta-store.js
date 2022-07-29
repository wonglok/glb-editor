import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import create from 'zustand'
import { makeAvatarCTX } from '../ctx/make-avatar-ctx'
import { sceneToCollider } from './scene-to-bvh'

export const useMetaStore = create((set, get) => {
  // return

  let myCTX = makeAvatarCTX()
  return {
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

      //
      let controls = new OrbitControls(camera, dom)

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

    setAction: (v, repeats = Infinity, restoreAction = 'stand') => {
      myCTX.avatarActionName = v
      myCTX.avatarActionRepeat = repeats
      myCTX.avatarActionResumeOnKeyUp = restoreAction

      set({ myCTX: myCTX })
    },

    setKeyboard: () => {
      let setAction = get().setAction

      let onKeyDown = (e) => {
        switch (e.code) {
          case 'KeyX':
            myCTX.avatarActionResumeOnKeyUp = 'fightready'
            setAction('fightReady', 1)
            break
          case 'KeyV':
            setAction('wramup', 1)
            break
          case 'KeyR':
            setAction('backflip', 1)
            break
          case 'KeyW':
            myCTX.fwdPressed = true
            setAction('front')
            break
          case 'KeyF':
            myCTX.xPressed = true
            setAction('sidekick', 1)
            break
          case 'KeyS':
            myCTX.bkdPressed = true
            setAction('back')
            break
          case 'KeyD':
            myCTX.rgtPressed = true
            setAction('right')
            break
          case 'KeyA':
            myCTX.lftPressed = true
            setAction('left')
            break
          case 'KeyE':
            myCTX.rgtRotPressed = true
            break
          case 'KeyQ':
            myCTX.lftRotPressed = true
            break
          case 'ArrowUp':
            myCTX.fwdPressed = true
            setAction('running')
            break
          case 'ArrowDown':
            myCTX.bkdPressed = true
            setAction('running')
            break
          case 'ArrowRight':
            myCTX.rgtPressed = true
            setAction('running')
            break
          case 'ArrowLeft':
            myCTX.lftPressed = true
            setAction('running')
            break
          case 'Space':
            if (myCTX.playerIsOnGround) {
              myCTX.playerVelocity.y = 10.0
              setAction('jump')
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
            //myCTX.avatarActionResumeOnKeyUp
            myCTX.xPressed = false
        }

        if (
          myCTX.avatarActionResumeOnKeyUp &&
          myCTX.avatarActionRepeat === Infinity
        ) {
          setAction(myCTX.avatarActionResumeOnKeyUp)
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

    myCTX,

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
