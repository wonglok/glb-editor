import { Box3 } from 'three'
import { Matrix4 } from 'three'
import { Mesh } from 'three'
import { Spherical } from 'three'
import { MeshStandardMaterial } from 'three'
import { Line3 } from 'three'
import { Vector3 } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { TJCore } from '@/vfx-core/TJCore.js'

export class Chaser {
  constructor({
    name = 'Chaser Core',
    chaseTarget,
    api,
    Settings,
    visible = true,

    speedFactor = 1,

    collider,
    scene,
    chaseDistance = 0.7,
  }) {
    let sub = new TJCore({ name: name, parent: api, selfloop: false })

    api.onLoop(() => {
      sub.work()
    })

    this.sub = sub
    sub.onClean(() => {
      sub.pause()
    })

    this.clean = () => {
      sub.clean()
    }

    this.target = chaseTarget
    this.chaseTarget = chaseTarget

    let playerIsOnGround = false
    let fwdPressed = false,
      bkdPressed = false,
      lftPressed = false,
      rgtPressed = false

    //
    let playerVelocity = new Vector3()
    let upVector = new Vector3(0, 1, 0)
    let tempVector = new Vector3()
    let tempVector2 = new Vector3()
    let tempBox = new Box3()
    let tempMat = new Matrix4()
    let tempSegment = new Line3()
    let radiusPlayer = 1
    let player = new Mesh(
      new RoundedBoxGeometry(1.0, 2.0, 1.0, 7, radiusPlayer),
      new MeshStandardMaterial()
    )
    player.geometry.translate(0, -radiusPlayer, 0)
    player.capsuleInfo = {
      radius: radiusPlayer,
      segment: new Line3(new Vector3(), new Vector3(0, -1.0, 0.0)),
    }
    this.player = player

    this.player.visible = visible

    this.walker = player

    scene.add(player)
    sub.onClean(() => {
      scene.remove(player)
    })

    let spherical = new Spherical()
    let sOffset = new Vector3()

    sub.onLoop((dt) => {
      chaseTarget.getWorldPosition(targetV3)
      targetV3.y = player.position.y
      player.lookAt(targetV3)

      if (player.position.distanceTo(targetV3) >= chaseDistance) {
        sub.now.running = true
        fwdPressed = true
      } else {
        sub.now.running = false
        fwdPressed = false
      }

      updatePlayer(dt)
    })

    let resetPlayer = (inputV3) => {
      playerVelocity.set(0, 0, 0)
      player.position.fromArray(inputV3 || targetV3.toArray())
      player.rotation.set(0, 0, 0)
      // camera.position.sub(controls.target);
      // controls.target.copy(player.position);
      // camera.position.add(player.position);
      // controls.update();
    }
    this.resetPlayer = resetPlayer

    let targetV3 = new Vector3()
    let playerTemp = player.clone()

    let updatePlayer = (delta) => {
      playerTemp.position.copy(player.position)
      chaseTarget.getWorldPosition(targetV3)
      targetV3.y = chaseTarget.position.y
      playerTemp.lookAt(targetV3)

      sOffset.set(0, 0, -10)
      sOffset.applyQuaternion(playerTemp.quaternion)
      spherical.setFromVector3(sOffset)

      playerVelocity.y += playerIsOnGround ? 0 : delta * Settings.gravity
      player.position.addScaledVector(playerVelocity, delta * 3)

      // move the player
      const angle = spherical.theta
      // const diff = Math.abs(spherical.phi - Math.PI / 2);

      if (fwdPressed) {
        tempVector.set(0, 0, -1).applyAxisAngle(upVector, angle)
        player.position.addScaledVector(
          tempVector,
          Settings.playerSpeed * 0.7 * speedFactor * delta
        )
      }

      if (bkdPressed) {
        tempVector.set(0, 0, 1).applyAxisAngle(upVector, angle)
        player.position.addScaledVector(
          tempVector,
          Settings.playerSpeed * 0.7 * delta
        )
      }

      if (lftPressed) {
        tempVector.set(-1, 0, 0).applyAxisAngle(upVector, angle)
        player.position.addScaledVector(
          tempVector,
          Settings.playerSpeed * 0.7 * delta
        )
      }

      if (rgtPressed) {
        tempVector.set(1, 0, 0).applyAxisAngle(upVector, angle)
        player.position.addScaledVector(
          tempVector,
          Settings.playerSpeed * 0.7 * delta
        )
      }

      player.updateMatrixWorld()

      // adjust player position based on collisions
      const capsuleInfo = player.capsuleInfo
      tempBox.makeEmpty()
      tempMat.copy(collider.matrixWorld).invert()
      tempSegment.copy(capsuleInfo.segment)

      // get the position of the capsule in the local space of the collider
      tempSegment.start.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)
      tempSegment.end.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)

      // get the axis aligned bounding box of the capsule
      tempBox.expandByPoint(tempSegment.start)
      tempBox.expandByPoint(tempSegment.end)

      tempBox.min.addScalar(-capsuleInfo.radius)
      tempBox.max.addScalar(capsuleInfo.radius)

      collider.geometry.boundsTree.shapecast({
        intersectsBounds: (box) => box.intersectsBox(tempBox),

        intersectsTriangle: (tri) => {
          // check if the triangle is intersecting the capsule and adjust the
          // capsule position if it is.
          const triPoint = tempVector
          const capsulePoint = tempVector2

          const distance = tri.closestPointToSegment(
            tempSegment,
            triPoint,
            capsulePoint
          )
          if (distance < capsuleInfo.radius) {
            const depth = capsuleInfo.radius - distance
            const direction = capsulePoint.sub(triPoint).normalize()

            tempSegment.start.addScaledVector(direction, depth)
            tempSegment.end.addScaledVector(direction, depth)
          }
        },
      })

      // get the adjusted position of the capsule collider in world space after checking
      // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
      // the origin of the player model.
      const newPosition = tempVector
      newPosition.copy(tempSegment.start).applyMatrix4(collider.matrixWorld)

      // check how much the collider was moved
      const deltaVector = tempVector2
      deltaVector.subVectors(newPosition, player.position)

      // if the player was primarily adjusted vertically we assume it's on something we should consider ground
      playerIsOnGround =
        deltaVector.y > Math.abs(delta * playerVelocity.y * 0.25)

      const offset = Math.max(0.0, deltaVector.length() - 1e-5)
      deltaVector.normalize().multiplyScalar(offset)

      // adjust the player model
      player.position.add(deltaVector)

      if (!playerIsOnGround) {
        //
        deltaVector.normalize()

        playerVelocity.addScaledVector(
          deltaVector,
          -deltaVector.dot(playerVelocity)
        )
      } else {
        playerVelocity.set(0, 0, 0)
      }

      // if the player has fallen too far below the level reset their position to the start
      if (
        player.position.y < -25 ||
        player.position.distanceTo(chaseTarget.position) >= 25
      ) {
        playerVelocity.set(0, 0, 0)
        player.position.y = chaseTarget.position.y + 1
        player.position.x = chaseTarget.position.x + 1
        player.position.z = chaseTarget.position.z
        // resetPlayer({ position: chaseTarget.position });
        // onSwitchCam(Settings.firstPerson);
      }
    }

    return this
  }
}

if (module.hot) {
  module.hot.dispose(() => {
    window.dispatchEvent(new CustomEvent('reload'))
  })
}
