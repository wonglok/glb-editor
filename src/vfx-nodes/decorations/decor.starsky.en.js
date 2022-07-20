//

import { getID } from '@/vfx-runtime/ENUtils'
import { StarSky } from '@/vfx-library/StarSky/StarSky'
// import { getID } from 'vfx-runtime/ENUtils'

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

    //
    material: [],

    uniforms: [
      {
        _id: getID(),
        nodeID,

        name: 'speed',
        type: 'float',
        value: 1,
      },
      {
        _id: getID(),
        nodeID,

        name: 'colorA',
        type: 'color',
        value: '#ef05ba',
      },
      {
        _id: getID(),
        nodeID,

        name: 'colorB',
        type: 'color',
        value: '#02ffe0',
      },
      {
        _id: getID(),
        nodeID,

        name: 'colorC',
        type: 'color',
        value: '#ffffff',
      },
    ],

    //
    shaders: [],
  }
}

export function effect({ node, mini, data }) {
  let myStarSky = new StarSky({})

  data.uniforms.speed((v) => {
    if (v && typeof v.value !== 'undefined') {
      myStarSky.speed = v.value
    }
  })

  data.uniforms.colorA((v) => {
    if (v && typeof v.value !== 'undefined') {
      myStarSky.colorA = v.value
    }
  })

  data.uniforms.colorB((v) => {
    if (v && typeof v.value !== 'undefined') {
      myStarSky.colorB = v.value
    }
  })

  data.uniforms.colorC((v) => {
    if (v && typeof v.value !== 'undefined') {
      myStarSky.colorC = v.value
    }
  })

  node.out0.pulse(myStarSky)
}

//

//

//

//

//

//
