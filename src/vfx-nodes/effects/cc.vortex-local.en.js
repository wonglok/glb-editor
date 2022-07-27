import { TheVortex } from '@/vfx-library/TheVortex/TheVortex'
import { getID } from '@/vfx-runtime/ENUtils'

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
  let myItem = new TheVortex({ enableDetection: false })

  myItem.scale.setScalar(0.015)
  mini.now.mounter.add(myItem)
  mini.onClean(() => {
    myItem.removeFromParent()
  })

  //

  // data.uniforms.speed((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     myItem.speed = v.value
  //   }
  // })

  // data.uniforms.colorA((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     myItem.colorA = v.value
  //   }
  // })

  // data.uniforms.colorB((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     myItem.colorB = v.value
  //   }
  // })

  // data.uniforms.colorC((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     myItem.colorC = v.value
  //   }
  // })

  // node.out0.pulse(myItem)
}

//

//
