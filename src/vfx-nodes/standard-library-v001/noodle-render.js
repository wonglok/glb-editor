import { getID } from '@/vfx-runtime/ENUtils'
import { Object3D } from 'three140'

//

const getUniforms = ({ nodeID = '' }) => {
  return [
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
    {
      id: getID(),
      nodeID,
      name: 'shader',
      type: `glsl`,
      value: `
`,
    },
  ]
}

let DefaultValue = getUniforms({})

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

    uniforms: getUniforms({ nodeID }),

    shaders: [],

    //
  }
}

export function effect({ node, mini, data }) {
  let myItem = new Object3D()

  mini.now.scene.add(myItem)
  mini.onClean(() => {
    myItem.removeFromParent()
  })

  // mini.onLoop(() => {
  //   mini.now.mounter.getWorldPosition(myItem.position)
  // })

  data.uniforms.shader((v) => {
    if (v && typeof v.value !== 'undefined') {
      myItem.shader = v.value
    }
  })

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
