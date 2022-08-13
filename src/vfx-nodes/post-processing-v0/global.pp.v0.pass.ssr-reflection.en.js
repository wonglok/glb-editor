import { getID } from '@/vfx-runtime/ENUtils'
import { Bloom, SSR } from '@react-three/postprocessing'
//

let props = {
  temporalResolve: true,
  STRETCH_MISSED_RAYS: true,
  USE_MRT: true,
  USE_NORMALMAP: true,
  USE_ROUGHNESSMAP: true,
  ENABLE_JITTERING: true,
  ENABLE_BLUR: true,
  DITHERING: false,
  temporalResolveMix: 0.5,
  temporalResolveCorrectionMix: 0.5,
  maxSamples: 0,
  resolutionScale: 1,
  blurMix: 0.5,
  blurKernelSize: 8,
  BLUR_EXPONENT: 10,
  rayStep: 0.5,
  intensity: 3.5,
  maxRoughness: 1,
  jitter: 1.4,
  jitterSpread: 0.05,
  jitterRough: 1,
  roughnessFadeOut: 1,
  rayFadeOut: 0,
  MAX_STEPS: 20,
  NUM_BINARY_SEARCH_STEPS: 6,
  maxDepthDifference: 7,
  maxDepth: 1,
  thickness: 7.6,
  ior: 1.33,
}

export async function nodeData({ defaultData, nodeID }) {
  let uniforms = []
  let getType = (value) => {
    if (typeof value === 'boolean') {
      return 'bool'
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
    node.out0.pulse(<SSR key={getID()} {...defaultConfig} />)
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

  //
}
