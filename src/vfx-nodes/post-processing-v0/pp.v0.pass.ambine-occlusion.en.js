import { getID } from '@/vfx-runtime/ENUtils'
import { SSAO } from '@react-three/postprocessing'

let props = {
  samples: 30, // amount of samples per pixel (shouldn't be a multiple of the ring count)
  rings: 4, // amount of rings in the occlusion sampling pattern
  distanceThreshold: 1.0, // global distance threshold at which the occlusion effect starts to fade out. min: 0, max: 1
  distanceFalloff: 0.0, // distance falloff. min: 0, max: 1
  rangeThreshold: 0.5, // local occlusion range threshold at which the occlusion starts to fade out. min: 0, max: 1
  rangeFalloff: 0.1, // occlusion range falloff. min: 0, max: 1
  luminanceInfluence: 0.9, // how much the luminance of the scene influences the ambient occlusion
  radius: 20, // occlusion sampling radius
  scale: 0.5, // scale of the ambient occlusion
  bias: 0.5, // occlusion bias
}

export async function nodeData({ defaultData, nodeID }) {
  let uniforms = []
  let getType = (value) => {
    if (typeof value === 'undefined') {
      return 'bool'
    } else if (typeof value === 'boolean') {
      return 'bool'
    } else if (typeof value === 'string') {
      return 'text'
    } else if (typeof value === 'number') {
      return 'float'
    } else if (value === null) {
      return 'bool'
    }
  }
  for (let kn in props) {
    let newItem = {
      _id: getID(),
      nodeID,
      name: kn,
      type: getType(props[kn]),
      value: props[kn],
    }
    uniforms.push(newItem)
  }

  return {
    ...defaultData,

    //
    //
    inputs: [
      //
      { _id: getID(), type: 'input', nodeID },
    ],

    // at least 1
    //
    outputs: [
      //
      { _id: getID(), type: 'output', nodeID },
    ],

    //
    material: [],

    uniforms: [...uniforms],

    //
    shaders: [],

    //
  }
}

export function effect({ node, mini, data, setComponent }) {
  let defaultConfig = {}
  let send = () => {
    node.out0.pulse(<SSAO key={getID()} {...defaultConfig} />)
  }

  let keys = Object.keys(props)
  for (let key of keys) {
    defaultConfig[key] = data.value[key]
  }

  let needsUpdate = true
  for (let key of keys) {
    data.uniforms[key]((signal) => {
      defaultConfig[key] = signal.value
      needsUpdate = true
    })
  }

  let tt = setInterval(() => {
    if (needsUpdate) {
      needsUpdate = false
      send()
    }
  }, 1)
  mini.onClean(() => {
    clearInterval(tt)
  })

  //
}
