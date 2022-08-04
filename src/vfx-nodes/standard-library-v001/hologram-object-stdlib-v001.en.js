import { getID } from '@/vfx-runtime/ENUtils'
import { BoxBufferGeometry, SphereBufferGeometry } from 'three'
import { Color, Mesh, MeshPhysicalMaterial, Object3D } from 'three140'

class MyObject3D extends Object3D {
  static headerV = `

varying float vH;
uniform float time;

`

  static bodyV = `

float sizer = (0.5 + 0.5 * sin(position.z * 6.0 +  5.0 * time)) * 1.0 + 0.1;
vec3 transformed = vec3( position );
transformed.xy *= sizer;
vH = sizer;

`

  static headerF = `

varying float vH;
uniform float time;

`
  static bodyF = `

float ratioA = abs(sin(vH * 56.0 + time * -10.0));
float ratioB = abs(sin(vH * 56.0 + time * 10.0));
float ratioC = abs(sin(vH * 56.0 + time * -20.0));
gl_FragColor.rgb *= ratioB * ratioA * vec3(1.0, 1.0, 1.0);

gl_FragColor.rgb *= ratioC;

gl_FragColor.rgb *= rand(vec2(time)) * 30.0;
gl_FragColor.a = ratioA * 0.5;

`

  constructor({ mini, tracker, itself }) {
    super()
    //
    // this._headerV = ''
    // this._bodyV = ''
    // this._headerF = ''
    // this._bodyF = ''

    this._headerV = '' + MyObject3D.headerV
    this._bodyV = '' + MyObject3D.bodyV
    this._headerF = '' + MyObject3D.headerF
    this._bodyF = '' + MyObject3D.bodyF

    this._tintColor = new Color('#ffffff')
    this._emissiveColor = new Color('#ffffff')

    let geo = new SphereBufferGeometry(1, 32, 32)
    let mat = new MeshPhysicalMaterial({
      wireframe: false,
      color: this._tintColor,
      emissive: this._emissiveColor,
      transmission: 0,
      ior: 1.4,
      transparent: true,
      wireframe: false,
    })
    this.mat = mat

    this.makeShader = () => {
      let fnc = (shader, renderer) => {
        // shader.fragmentShader = ``

        let t = { value: 0 }
        shader.uniforms.time = t

        if (mini) {
          mini.onLoop((dt) => {
            t.value += dt
          })
        }
        //

        shader.vertexShader = shader.vertexShader.replace(
          `void main() {`,
          `${this._headerV.trim()}
          void main() {`
        )
        shader.vertexShader = shader.vertexShader.replace(
          `#include <begin_vertex>`,
          `${this._bodyV}`
        )
        shader.fragmentShader = `${this._headerF.trim()}\n${
          shader.fragmentShader
        }`
        shader.fragmentShader = shader.fragmentShader.replace(
          `#include <dithering_fragment>`,
          `#include <dithering_fragment>\n${this._bodyF.trim()}`
        )
      }

      return fnc
    }

    //
    //
    mat.onBeforeCompile = this.makeShader()
    mat.customProgramCacheKey = () => {
      return getID()
    }
    mat.needsUpdate = true

    this.sync = () => {
      mat.onBeforeCompile = this.makeShader()
      mat.customProgramCacheKey = () => {
        return getID()
      }
      mat.needsUpdate = true
    }

    this.box = new Mesh(geo, mat)
    this.add(this.box)
  }
  //

  set headerV(v) {
    this._headerV = v
    this.sync()
  }
  get headerV() {
    return this._headerV
  }
  set bodyV(v) {
    this._bodyV = v
    this.sync()
  }
  get bodyV() {
    return this._bodyV
  }
  //

  set headerF(v) {
    this._headerF = v
    this.sync()
  }
  get headerF() {
    return this._headerF
  }
  set bodyF(v) {
    this._bodyF = v
    this.sync()
  }
  get bodyF() {
    return this._bodyF
  }

  //
  set tintColor(v) {
    this._tintColor.set(v)
    this.mat.color = this._tintColor
  }
  set emissiveColor(v) {
    this._emissiveColor.set(v)
    this.mat.emissive = this._emissiveColor
  }
  set colorC(v) {
    this._colorC.set(v)
  }

  get tintColor() {
    return '#' + this._tintColor.getHexString()
  }
  get emissiveColor() {
    return '#' + this._emissiveColor.getHexString()
  }
  get colorC() {
    return '#' + this._colorC.getHexString()
  }
}

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
    ],

    // at least 1
    //
    outputs: [
      //
      { _id: getID(), type: 'output', nodeID },
      { _id: getID(), type: 'output', nodeID },
      { _id: getID(), type: 'output', nodeID },
    ],

    //
    material: [],

    uniforms: [
      {
        _id: getID(),
        nodeID,

        name: 'tintColor',
        type: 'color',
        value: '#ef05ba',
      },
      {
        _id: getID(),
        nodeID,

        name: 'emissiveColor',
        type: 'color',
        value: '#02ffe0',
      },

      {
        id: getID(),
        nodeID,
        name: 'headerV',
        type: `glsl`,
        value: MyObject3D.headerV,
      },
      {
        id: getID(),
        nodeID,
        name: 'bodyV',
        type: `glsl`,
        value: MyObject3D.bodyV,
      },
      {
        id: getID(),
        nodeID,
        name: 'headerF',
        type: `glsl`,
        value: MyObject3D.headerF,
      },
      {
        id: getID(),
        nodeID,
        name: 'bodyF',
        type: `glsl`,
        value: MyObject3D.bodyF,
      },
    ],

    //
    shaders: [],

    //

    //
  }
}

export function effect({ node, mini, data }) {
  let myItem = new MyObject3D({
    tracker: mini.now.mounter,
    mini,
    itself: mini.now.itself,
  })

  //
  mini.now.scene.add(myItem)
  mini.onClean(() => {
    myItem.removeFromParent()
  })

  data.uniforms.headerV((v) => {
    if (v && typeof v.value !== 'undefined') {
      myItem.headerV = v.value
    }
  })
  data.uniforms.bodyV((v) => {
    if (v && typeof v.value !== 'undefined') {
      myItem.bodyV = v.value
    }
  })

  data.uniforms.headerF((v) => {
    if (v && typeof v.value !== 'undefined') {
      myItem.headerF = v.value
    }
  })

  data.uniforms.bodyF((v) => {
    if (v && typeof v.value !== 'undefined') {
      myItem.bodyF = v.value
    }
  })

  data.uniforms.tintColor((v) => {
    if (v && typeof v.value !== 'undefined') {
      myItem.tintColor = v.value
    }
  })

  data.uniforms.emissiveColor((v) => {
    if (v && typeof v.value !== 'undefined') {
      myItem.emissiveColor = v.value
    }
  })

  // node.out0.pulse(myItem)
}

//

//
