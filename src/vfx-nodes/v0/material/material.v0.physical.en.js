import { getID } from '@/vfx-runtime/ENUtils'
import { createPortal } from '@react-three/fiber'
import { BackSide, FrontSide, sRGBEncoding } from 'three'
import {
  Color,
  DoubleSide,
  MeshPhysicalMaterial,
  Texture,
  TextureLoader,
} from 'three140'
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
      name: 'metalness',
      type: 'float',
      value: 0,
      protected: true,
    },
    {
      _id: getID(),
      nodeID,
      name: 'roughness',
      type: 'float',
      value: 0.5,
      protected: true,
    },
    {
      _id: getID(),
      nodeID,
      name: 'transmission',
      type: 'float',
      value: 0,
      protected: true,
    },
    {
      _id: getID(),
      nodeID,
      name: 'thickness',
      type: 'float',
      value: 1,
      protected: true,
    },
    //
    {
      _id: getID(),
      nodeID,
      name: 'ior',
      type: 'float',
      value: 1.45,
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
      name: 'mapFlipY',
      type: 'bool',
      value: false,
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
      name: 'emissiveMapFlipY',
      type: 'bool',
      value: false,
      protected: true,
    },
    {
      _id: getID(),
      nodeID,
      name: 'emissiveIntensity',
      type: 'float',
      value: 1,
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
      name: 'normalMapFlipY',
      type: 'bool',
      value: false,
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
      name: 'roughnessMapFlipY',
      type: 'bool',
      value: false,
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
      name: 'metalnessMapFlipY',
      type: 'bool',
      value: false,
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
    {
      _id: getID(),
      nodeID,
      name: 'transmissionMapFlipY',
      type: 'bool',
      value: false,
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
  //
  let send = () => {
    if (!mini.now.itself.material) {
      mini.now.itself.material = new MeshPhysicalMaterial()
    }

    if (!original.has(data.raw.nodeID)) {
      original.set(data.raw.nodeID, mini.now.itself.material.clone())
    }

    let clonedOrig = original.get(data.raw.nodeID).clone()

    //
    delete clonedOrig.defines

    //
    let newMat = new MeshPhysicalMaterial({ ...clonedOrig })

    defs.uniforms.forEach((uni) => {
      let val = data.value[uni.name]

      if (val) {
        if (uni.name === 'side') {
          newMat[uni.name] = getSide(val)
        } else if (uni.name === 'map') {
          newMat[uni.name] = loadTexture(val)
          newMat[uni.name].flipY = data.value[uni.anme + 'FlipY']
        } else if (uni.name === 'emissiveMap') {
          newMat[uni.name] = loadTexture(val)
          newMat[uni.name].flipY = data.value[uni.anme + 'FlipY']
        } else if (uni.name === 'normalMap') {
          newMat[uni.name] = loadTexture(val)
          newMat[uni.name].flipY = data.value[uni.anme + 'FlipY']
        } else if (uni.type === 'float') {
          newMat[uni.name] = val
        } else if (uni.type === 'color') {
          newMat[uni.name] = new Color(val)
        }
        /*
        else if (uni.type === 'texture') {
          // needs fix
          newMat[uni.name] = loadTexture(val)
        }
        */
      }

      //
    })

    //
    mini.now.itself.material = newMat
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
        send()
      }
    })
    //
  })

  send()

  //
  //
  //
}
