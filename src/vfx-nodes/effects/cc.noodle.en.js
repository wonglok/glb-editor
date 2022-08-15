import { NoodleRenderable } from '@/vfx-library/Noodle/NoodleRenderable'
import { NoodleSegmentCompute } from '@/vfx-library/Noodle/NoodleSegmentCompute'
import { ParticleRenderable } from '@/vfx-library/Noodle/ParticleRenderable'
import { PhysicsCompute } from '@/vfx-library/Noodle/PhysicsCompute'
import { getID } from '@/vfx-runtime/ENUtils'
import { FrontSide } from 'three'
import { Color } from 'three140'

//

export async function nodeData({ defaultData, nodeID }) {
  return {
    ...defaultData,

    //
    //
    inputs: [
      //
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
    ],

    // at least 1
    //
    outputs: [
      //
      { _id: getID(), type: 'output', nodeID },
      { _id: getID(), type: 'output', nodeID },
      { _id: getID(), type: 'output', nodeID },
    ],

    uniforms: [
      //       {
      //         _id: getID(),
      //         nodeID,
      //         name: 'speed',
      //         type: 'float',
      //         value: 1,
      //       },
      //       {
      //         _id: getID(),
      //         nodeID,
      //         name: 'colorA',
      //         type: 'color',
      //         value: '#ef05ba',
      //       },
      //       {
      //         _id: getID(),
      //         nodeID,
      //         name: 'colorB',
      //         type: 'color',
      //         value: '#02ffe0',
      //       },
      //       {
      //         _id: getID(),
      //         nodeID,
      //         name: 'colorC',
      //         type: 'color',
      //         value: '#ffffff',
      //       },
      //       {
      //         id: getID(),
      //         nodeID,
      //         name: 'shader',T
      //         type: `glsl`,
      //         value: `
      //         `,
      //       },
    ],

    //
    shaders: [],
    material: [],

    //
  }
}

export async function effect({ node, mini, data }) {
  //

  let howManyTracker = 256
  let howLongTail = 32

  let physics = new PhysicsCompute({
    sizeX: 1,
    sizeY: howManyTracker,
    tracker: mini.now.mounter,
  })

  let sim = new NoodleSegmentCompute({
    node: mini,
    tracker: mini.now.mounter,
    getTextureAlpha: () => {
      return physics.getHeadList()
    },
    howManyTracker: howManyTracker,
    howLongTail: howLongTail,
  })

  let renderConfig = {
    color: new Color('#00ffff'),
    transparent: true,
    roughness: 0,
    metalness: 1,
    side: FrontSide,
    reflectivity: 0,
    transmission: 0,
    ior: 1,
  }

  let scene = mini.now.scene

  let noodle = new NoodleRenderable({
    renderConfig,
    node: mini,
    sim,
    howManyTracker: howManyTracker,
    howLongTail: howLongTail,
  })

  scene.add(noodle.o3d)

  let pars = new ParticleRenderable({
    renderConfig,
    sizeX: 1,
    sizeY: howManyTracker,
    core: mini,
    getTextureAlpha: () => {
      return physics.getHeadList()
    },
    getTextureBeta: () => {
      return physics.getHeadList2()
    },
  })

  scene.add(pars)
}

//
//
