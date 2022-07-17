import path from 'path'
import {
  Color,
  EquirectangularReflectionMapping,
  sRGBEncoding,
  TextureLoader,
} from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { getID } from '@/vfx-runtime/ENUtils'

export async function nodeData({ defaultData, nodeID }) {
  return {
    ...defaultData,

    //
    inputs: [
      //
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
export async function effect({ node, mini }) {
  //

  let color = await node.in0.ready

  mini.ready.scene.then((scene) => {
    scene.background = new Color(color)
  })
}
