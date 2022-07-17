import { getID } from '@/vfx-runtime/ENUtils'
import path from 'path'
import {
  EquirectangularReflectionMapping,
  sRGBEncoding,
  TextureLoader,
} from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

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
    uniforms: [
      {
        _id: getID(),
        nodeID,

        name: 'hdrURL',
        type: 'text',
        value: `/hdr/greenwich_park_02_1k.hdr`,
      },
    ],
  }
}
export async function effect({ node, mini, data }) {
  data.uniforms.hdrURL((data) => {
    let url = data.value

    let ext = path.extname(url)

    if (ext.includes('hdr')) {
      new RGBELoader().load(url, (tx) => {
        mini.ready.scene.then((scene) => {
          tx.mapping = EquirectangularReflectionMapping
          scene.environment = tx
        })
      })
    } else {
      new TextureLoader().load(url, (tx) => {
        mini.ready.scene.then((scene) => {
          tx.encoding = sRGBEncoding
          tx.mapping = EquirectangularReflectionMapping
          scene.environment = tx
        })
      })
    }
  })
}
