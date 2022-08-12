import { getID } from '@/vfx-runtime/ENUtils'
import { Bloom } from '@react-three/postprocessing'
//

let props = {
  //
  intensity: 1.0, // The bloom intensity.
  // blurPass: 0.0, // A blur pass.
  // width: 256, // render width
  // height: 256, // render height
  // kernelSize: 2.0, // blur kernel size
  luminanceThreshold: 0.2, // luminance threshold. Raise this value to mask out darker elements in the scene.
  luminanceSmoothing: 0.025, // smoothness of the luminance threshold. Range is [0, 1]
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

  let keys = Object.keys(props)

  let send = () => {
    for (let key of keys) {
      defaultConfig[key] = data.value[key]
    }

    node.out0.pulse(<Bloom key={getID()} {...defaultConfig} />)
  }

  send()

  for (let key of keys) {
    data.uniforms[key](() => {
      send()
    })
  }

  //
}

//

/*
<SSR premultiply={true} opacity={0.2} />

<SSR {...props} />
<Bloom
  luminanceThreshold={0.2}
  mipmapBlur
  luminanceSmoothing={0}
  intensity={0.5}
/>
<LUT lut={texture} />
{/* <DepthOfField
    focusDistance={2}
    focalLength={0.02}
    bokehScale={2}
    height={480}
  />

  */
