import { useRender } from '@/vfx-meta/store/use-render'
import { getID } from '@/vfx-runtime/ENUtils'
import {
  Color,
  EquirectangularReflectionMapping,
  sRGBEncoding,
  TextureLoader,
} from 'three140'
import { RGBELoader } from 'three140/examples/jsm/loaders/RGBELoader'

let props = {
  type: 'hdr', // color, hdr, texture
  input: 'in0',
  color: '#ff00ff', // vignette offset
  hdr: '/hdr/default.hdr', // vignette offset
  texture: '/hdr/default.png', // vignette offset
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

  //
  let send = () => {
    mini.ready.scene.then((s) => {
      if (defaultConfig.type === 'color') {
        s.background = new Color(defaultConfig.color)
      } else if (defaultConfig.type === 'hdr') {
        let rgbe = new RGBELoader()
        rgbe.load(defaultConfig.hdr, (t) => {
          t.mapping = EquirectangularReflectionMapping
          s.background = t
        })
      } else if (defaultConfig.type === 'texture') {
        let loader = new TextureLoader()
        loader.load(defaultConfig.texture, (t) => {
          t.encoding = sRGBEncoding
          t.mapping = EquirectangularReflectionMapping
          s.background = t
        })
      } else if (defaultConfig.type === 'input') {
        node[defaultConfig.input].ready.then((s) => {
          s.environment = s
        })
      }
    })

    useRender.getState().setEnableDefaultHDR(false)

    // node.out0.pulse(<Vignette key={getID()} {...defaultConfig} />)
  }

  mini.onClean(() => {
    useRender.getState().setEnableDefaultHDR(true)
  })

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
