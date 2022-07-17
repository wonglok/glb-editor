import { Object3D } from 'three'
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
    shaders: [],
  }
}

export async function effect({ mini, node }) {
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

  let mounter = await mini.ready.mounter
  mounter.add(o3d)
}

//

//

//
