import { getID } from '@/vfx-runtime/ENUtils'
import { Bloom } from '@react-three/postprocessing'

let props = {
  intensity: 0.6, // The bloom intensity.
  kernelSize: 5, // blur kernel size
  luminanceThreshold: 0.3, // luminance threshold. Raise this value to mask out darker elements in the scene.
  luminanceSmoothing: 0.025, // smoothness of the luminance threshold. Range is [0, 1]
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
    node.out0.pulse(<Bloom key={getID()} {...defaultConfig} />)
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
