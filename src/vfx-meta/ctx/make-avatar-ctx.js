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

  let self = {
    setPositionByArray: (array) => {
      self.playerVelocity.set(0, 0, 0)
      self.player.position.fromArray(array)
    },

    //
    avatarURL: `/scene/loklokdemo/loklok-demo.glb`,
    avatarVendor: `rpm`,
    avatarRPMActionURLSet: [
      {
        //
        name: `stand`,
        repeats: Infinity,
        url: `/rpm/rpm-pose/standing-waiting.fbx`,
      },
      {
        //
        repeats: Infinity,
        name: `jump`,
        url: `/rpm/rpm-jog/jump.fbx`,
      },
      {
        inPlace: true,
        //
        repeats: Infinity,
        name: `front`,
        url: `/rpm/rpm-jog/jog-forward.fbx`,
      },
      {
        inPlace: true,

        repeats: Infinity,
        //
        name: `back`,
        url: `/rpm/rpm-jog/jog-backward.fbx`,
      },
      {
        inPlace: true,
        repeats: Infinity,

        //
        name: `left`,
        url: `/rpm/rpm-jog/jog-strafe-left.fbx`,
      },
      {
        repeats: Infinity,
        inPlace: true,

        //
        name: `right`,
        url: `/rpm/rpm-jog/jog-strafe-right.fbx`,
      },
      {
        repeats: 1,
        name: 'backflip',
        url: `/rpm/rpm-actions/back-flip.fbx`,
      },
      {
        repeats: 1,
        name: 'sidekick',
        url: `/rpm/rpm-actions/side-kick.fbx`,
      },
      {
        repeats: 1,
        name: `wramup`,
        url: `/rpm/rpm-actions/mma-warmup.fbx`,
      },
      {
        repeats: Infinity,
        name: 'fightready',
        url: `/rpm/rpm-actions/mma-idle.fbx`,
      },
    ],
    avatarActionResumeOnKeyUp: 'stand',
    avatarActionName: 'stand',
    avatarActionRepeat: Infinity,

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
