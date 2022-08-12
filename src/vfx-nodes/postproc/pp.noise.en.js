import { getID } from '@/vfx-runtime/ENUtils'
import { Bloom, EffectComposer, Noise } from '@react-three/postprocessing'
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
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
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

    uniforms: [
      {
        _id: getID(),
        nodeID,
        name: 'premultiply',
        type: 'bool',
        value: false,
      },
      {
        _id: getID(),
        nodeID,
        name: 'opacity',
        type: 'float',
        value: 0.2,
      },
    ],

    //
    shaders: [],

    //
  }
}

export function effect({ node, mini, data, setComponent }) {
  //
  // setComponent
  //
  //

  // let config = {}
  // // ...

  // let makeElemnet = () => {
  //   return (
  //     <EffectComposer>
  //       <Bloom
  //         luminanceThreshold={0.2}
  //         mipmapBlur
  //         luminanceSmoothing={0}
  //         intensity={0.5}
  //       />
  //     </EffectComposer>
  //   )
  // }

  let defaultConfig = {}

  let keys = ['premultiply', 'opacity']

  let send = () => {
    node.out0.pulse(<Noise key={getID()} {...defaultConfig} />)
  }

  for (let key of keys) {
    defaultConfig[key] = data.value[key]
  }
  for (let key of keys) {
    data.uniforms[key]((signal) => {
      defaultConfig[key] = signal.value
      send()
    })
  }

  //
}

//

/*
<Noise premultiply={true} opacity={0.2} />

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
