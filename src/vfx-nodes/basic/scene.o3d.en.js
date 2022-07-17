import { Object3D, Vector3 } from 'three'
import { getID } from '@/vfx-runtime/ENUtils'

export async function nodeData({ defaultData, nodeID }) {
  return {
    ...defaultData,

    //
    inputs: [
      //
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
    ],

    //
    outputs: [
      //
      { _id: getID(), type: 'output', nodeID },
    ],

    //
    material: [],

    //
    uniforms: [
      {
        _id: getID(),
        nodeID,

        name: 'position',
        type: 'vec3',
        value: { x: 0, y: 0, z: 0 },
      },
      {
        _id: getID(),
        nodeID,

        name: 'rotation',
        type: 'vec3',
        value: { x: 0, y: 0, z: 0 },
      },
      {
        _id: getID(),
        nodeID,

        name: 'scale',
        type: 'vec3',
        value: { x: 1, y: 1, z: 1 },
      },
    ],

    //
    shaders: [],
  }
}

export async function effect({ mini, node, data }) {
  //
  let o3d = new Object3D()

  mini.onClean(() => {
    o3d.removeFromParent()
  })

  node.data.inputs.forEach((it, idx) => {
    node['in' + idx].ready.then((v) => {
      if (!o3d.children.includes(v)) {
        o3d.add(v)
      }
    })
  })

  data.uniforms.position((data) => {
    console.log(data.value)
    if (typeof data.value !== 'undefined') {
      o3d.position.x = data.value.x
      o3d.position.y = data.value.y
      o3d.position.z = data.value.z
    }
  })

  data.uniforms.rotation((data) => {
    if (typeof data.value !== 'undefined') {
      o3d.rotation.x = data.value.x
      o3d.rotation.y = data.value.y
      o3d.rotation.z = data.value.z
    }
  })

  data.uniforms.scale((scale) => {
    if (typeof scale.value.z !== 'undefined') {
      o3d.scale.copy(scale.value)
    }
  })

  //

  node.data.outputs.forEach((it, idx) => {
    node['out' + idx].pulse(o3d)
  })
}
