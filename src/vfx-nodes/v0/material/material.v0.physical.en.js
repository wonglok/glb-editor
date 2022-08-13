import { getID } from '@/vfx-runtime/ENUtils'
import { createPortal } from '@react-three/fiber'
import { Color, Texture, TextureLoader } from 'three140'
// import { Bloom, EffectComposer, Noise } from '@react-three/postprocessing'
//
let getDefinitions = ({ nodeID }) => {
  //
  let db = [
    {
      _id: getID(),
      nodeID,
      name: 'map',
      type: 'texture',
      value: '',
    },
    {
      _id: getID(),
      nodeID,
      name: 'normalMap',
      type: 'texture',
      value: '',
    },
    {
      _id: getID(),
      nodeID,
      name: 'roughnessMap',
      type: 'texture',
      value: '',
    },
    {
      _id: getID(),
      nodeID,
      name: 'metalnessMap',
      type: 'texture',
      value: '',
    },
    {
      _id: getID(),
      nodeID,
      name: 'transmissionMap',
      type: 'texture',
      value: '',
    },
  ]

  let props = {}

  return {
    uniforms: db,
    props,
  }
}

export async function nodeData({ defaultData, nodeID }) {
  let defs = getDefinitions({ nodeID })

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
    ],

    // at least 1
    //
    outputs: [
      //
      { _id: getID(), type: 'output', nodeID },
      { _id: getID(), type: 'output', nodeID },
      { _id: getID(), type: 'output', nodeID },
      { _id: getID(), type: 'output', nodeID },
      { _id: getID(), type: 'output', nodeID },
    ],

    //
    material: [],

    //
    uniforms: [
      ...defs.uniforms,

      //
      //
      // {
      //   _id: getID(),
      //   nodeID,
      //   name: 'speed',
      //   type: 'float',
      //   value: 1,
      // },
      // {
      //   _id: getID(),
      //   nodeID,
      //   name: 'colorA',
      //   type: 'color',
      //   value: '#00ff89',
      // },
      // {
      //   id: getID(),
      //   nodeID,
      //   name: 'shader',
      //   type: `glsl`,
      //   value: `
      //   `,
      // },
      //
      //
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
  let defs = getDefinitions({ nodeID: data.raw.nodeID })

  let inputReceivers = {}

  let makeElemnet = () => {
    let props = {
      color: new Color('#ffffff'),
      map: new TextureLoader().load(data.value.map),
    }

    let kidz = []

    for (let socketInputName in inputReceivers) {
      if (inputReceivers[socketInputName]) {
        kidz.push(inputReceivers[socketInputName])
      }
    }

    return (
      <meshPhysicalMaterial
        attach={'material'}
        key={data.raw._id}
        {...mini.now.itself.material}
        {...props}
      >
        {kidz}
      </meshPhysicalMaterial>
    )
  }

  let send = () => {
    setComponent(createPortal(makeElemnet(inputReceivers), mini.now.itself))
  }

  let inputSockets = ['in0', 'in1', 'in2', 'in3', 'in4']

  inputSockets.forEach((socket) => {
    inputReceivers[socket] = null
    node[socket].stream((v) => {
      inputReceivers[socket] = v
      send()
    })
  })

  send()

  defs.uniforms.forEach((uni) => {
    //
    data.uniforms[uni.name]((signal) => {
      //
      send()
    })
  })
  //
  //
  //
}
