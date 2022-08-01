import { getID } from '@/vfx-runtime/ENUtils'
import {
  Box3,
  Line3,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
} from 'three'
import { RoundedBoxGeometry } from 'three140/examples/jsm/geometries/RoundedBoxGeometry'
import { Fashion } from '../game-parts/ClosetAvatar'

export const makeAvatarCTX = () => {
  // characters
  let player = new Mesh(
    new RoundedBoxGeometry(1.0, 2.0, 1.0, 10, 0.5),
    new MeshStandardMaterial()
  )
  player.name = 'myavatar'
  player.geometry.translate(0, -0.5, 0)
  player.capsuleInfo = {
    radius: 0.5,
    segment: new Line3(new Vector3(), new Vector3(0, -1.0, 0.0)),
  }

  let avatarPartUpper = Fashion[0].uppers[0].url
  let avatarPartLower = Fashion[0].lowers[0].url
  let avatarPartShoes = Fashion[0].shoes[0].url

  let avatarPartSkeleton = Fashion[0].uppers[0].url

  let self = {
    setPositionByArray: (array) => {
      self.playerVelocity.set(0, 0, 0)
      self.player.position.fromArray(array)
    },

    //
    avatarURL: `/scene/loklokdemo/loklok-demo.glb`,
    avatarVendor: `rpm`,

    //
    avatarURLTemp: `/scene/loklokdemo/loklok-demo.glb`,

    avatarActionResumeOnKeyUp: 'stand',
    avatarActionName: 'stand',
    avatarActionIdleName: 'stand',
    avatarActionRepeat: Infinity,
    //
    avatarPartUpper,
    avatarPartLower,
    avatarPartShoes,
    avatarPartSkeleton,

    playerIsOnGround: false,
    player,

    //
    gravity: -30,
    playerSpeed: 10,
    physicsSteps: 5,

    fwdPressed: false,
    bkdPressed: false,
    lftPressed: false,
    rgtPressed: false,
    lftRotPressed: false,
    rgtRotPressed: false,

    playerVelocity: new Vector3(),
    resetPositon: new Vector3(0, 3, 3),
    upVector: new Vector3(0, 1, 0),
    tempVector: new Vector3(),
    tempVector2: new Vector3(),
    tempBox: new Box3(),
    tempMat: new Matrix4(),
    tempSegment: new Line3(),
    deltaTarget: new Vector3(0, 0, 0),

    //
    coord: new Vector3(),
    quaternion: new Quaternion(),
  }

  return self
}
