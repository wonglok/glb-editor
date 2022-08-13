import { getID } from '@/vfx-runtime/ENUtils'
import { createPortal } from '@react-three/fiber'
import { BackSide, FrontSide, sRGBEncoding } from 'three'
import { Color, DoubleSide, Texture, TextureLoader } from 'three140'
// import { Bloom, EffectComposer, Noise } from '@react-three/postprocessing'
//
let getDefinitions = ({ nodeID }) => {
  //
  let db = [
    {
      _id: getID(),
      nodeID,
      name: 'side',
      type: 'string',
      value: 'front',
      protected: true,
    },
    {
      _id: getID(),
      nodeID,
      name: 'transparent',
      type: 'bool',
      value: false,
      protected: true,
    },

    {
      _id: getID(),
      nodeID,
      name: 'flatShading',
      type: 'bool',
      value: false,
      protected: true,
    },

    {
      _id: getID(),
      nodeID,
      name: 'color',
      type: 'color',
      value: '#ffffff',
      protected: true,
    },

    {
      _id: getID(),
      nodeID,
      name: 'emissive',
      type: 'color',
      value: '#000000',
      protected: true,
    },

    //
    {
      _id: getID(),
      nodeID,
      name: 'map',
      type: 'texture',
      value: '',
      protected: true,
    },
    {
      _id: getID(),
      nodeID,
      name: 'emissiveMap',
      type: 'texture',
      value: '',
      protected: true,
    },
    {
      _id: getID(),
      nodeID,
      name: 'normalMap',
      type: 'texture',
      value: '',
      protected: true,
    },
    {
      _id: getID(),
      nodeID,
      name: 'roughnessMap',
      type: 'texture',
      value: '',
      protected: true,
    },
    {
      _id: getID(),
      nodeID,
      name: 'metalnessMap',
      type: 'texture',
      value: '',
      protected: true,
    },
    {
      _id: getID(),
      nodeID,
      name: 'transmissionMap',
      type: 'texture',
      value: '',
      protected: true,
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

      // {
      //   id: getID(),
      //   nodeID,
      //   name: 'shader',
      //   type: `glsl`,
      //   value: `
      //   `,
      // },
    ],

    //
    shaders: [],

    //
  }
}

let textureCahce = new Map()
let loadTexture = (v) => {
  if (textureCahce.has(v)) {
    return textureCahce.get(v)
  } else {
    let out = new TextureLoader().load(v, (s) => {
      s.encoding = sRGBEncoding
    })
    textureCahce.set(v, out)
    return out
  }
}

let getSide = (side) => {
  if (side === 'front') {
    return FrontSide
  } else if (side === 'back') {
    return BackSide
  } else if (side === 'double') {
    return DoubleSide
  }
}

let original = new Map()
export function effect({ node, mini, data, setComponent }) {
  //
  // setComponent
  //
  let defs = getDefinitions({ nodeID: data.raw.nodeID })

  // let inputReceivers = {}

  // let makeElemnet = () => {

  //   let kidz = []

  //   for (let socketInputName in inputReceivers) {
  //     if (inputReceivers[socketInputName]) {
  //       kidz.push(inputReceivers[socketInputName])
  //     }
  //   }

  //   return (
  //   )
  // }

  let send = () => {
    if (original.has(data.raw.nodeID)) {
      mini.now.itself.material = original.get(data.raw.nodeID).clone()
    } else {
      original.set(data.raw.nodeID, mini.now.itself.material.clone())

      mini.now.itself.material = original.get(data.raw.nodeID).clone()
    }

    let props = {
      side: getSide(data.value.side),
      color: new Color(data.value.color),
      transparent: data.value.transparent,
      flatShading: data.value.flatShading,
      emissive: new Color(data.value.emissive),
      map: data.value.map ? loadTexture(data.value.map) : undefined,
      emissiveMap: data.value.emissiveMap
        ? loadTexture(data.value.emissiveMap)
        : undefined,
    }

    let propsApply = { ...props }

    for (let kn in propsApply) {
      if (typeof propsApply[kn] === 'undefined' || propsApply[kn] === null) {
        delete propsApply[kn]
      }
    }

    for (let kn in propsApply) {
      mini.now.itself.material[kn] = propsApply[kn]
    }
  }

  // let inputSockets = ['in0', 'in1', 'in2', 'in3', 'in4']

  // inputSockets.forEach((socket) => {
  //   inputReceivers[socket] = null
  //   node[socket].stream((v) => {
  //     inputReceivers[socket] = v
  //     send()
  //   })
  // })

  let last = {}
  defs.uniforms.forEach((uni) => {
    //
    data.uniforms[uni.name]((signal) => {
      if (last[uni.name] !== signal.value) {
        last[uni.name] = signal.value
        setTimeout(() => {
          send()
        })
      }
    })
    //
  })

  send()

  //
  //
  //
}
