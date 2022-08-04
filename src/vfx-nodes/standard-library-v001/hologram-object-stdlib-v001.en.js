import { getID } from '@/vfx-runtime/ENUtils'
import { BoxBufferGeometry, SphereBufferGeometry } from 'three'
import { Color, Mesh, MeshPhysicalMaterial, Object3D } from 'three140'

class MyObject3D extends Object3D {
  static headerVertexShader = `

varying float vH;
uniform float time;

`

  static bodyVertexShaderPosition = `

float sizer = (0.5 + 0.5 * sin(position.z * 6.0 +  5.0 * time)) * 1.0 + 0.1;
vec3 transformed = vec3( position );
transformed.xy *= sizer;
vH = sizer;

`

  static bodyVertexShaderNormal = `

float sizer = (0.5 + 0.5 * sin(position.z * 6.0 +  5.0 * time)) * 1.0 + 0.1;
vec3 transformed = vec3( position );
transformed.xy *= sizer;
vH = sizer;

`

  static headerFragmentShader = `

varying float vH;
uniform float time;

`
  static bodyFragmentShader = `


float ratioA = abs(sin(vH * 56.0 + time * -10.0));
float ratioB = abs(sin(vH * 56.0 + time * 10.0));
float ratioC = abs(sin(vH * 56.0 + time * -20.0));

vec4 yoColor;
yoColor.rgb = ratioB * ratioA * vec3(1.0, 1.0, 1.0);

#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor * yoColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor * yoColor.rgb;
#endif


diffuseColor.a = ratioA;

`

  constructor({ mini, tracker, itself }) {
    super()
    //
    // this._headerVertexShader = ''
    // this._bodyVertexShaderPosition = ''
    // this._headerFragmentShader = ''
    // this._bodyFragmentShader = ''

    this._headerVertexShader = '' + MyObject3D.headerVertexShader
    this._bodyVertexShaderPosition = '' + MyObject3D.bodyVertexShaderPosition
    this._bodyVertexShaderNormal = '' + MyObject3D.bodyVertexShaderNormal
    this._headerFragmentShader = '' + MyObject3D.headerFragmentShader
    this._bodyFragmentShader = '' + MyObject3D.bodyFragmentShader

    //
    this._tintColor = new Color('#ffffff')
    this._emissiveColor = new Color('#000000')

    let geo = new SphereBufferGeometry(1.3, 128, 128)
    let mat = new MeshPhysicalMaterial({
      wireframe: false,
      color: this._tintColor,
      emissive: this._emissiveColor,
      metalness: 0.3,
      transmission: 1.0,
      ior: 1.4,
      reflection: 1.5,
      roughness: 0.0,
      thickness: 0.1,
      transparent: true,
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
          `${this._headerVertexShader.trim()}
          void main() {`
        )
        shader.vertexShader = shader.vertexShader.replace(
          `#include <begin_vertex>`,
          `${this._bodyVertexShaderPosition}`
        )

        // shader.vertexShader = shader.vertexShader.replace(
        //   `#include <begin_vertex>`,
        //   `${this._bodyVertexShaderNormal}`
        // )

        shader.fragmentShader = `${this._headerFragmentShader.trim()}\n${
          shader.fragmentShader
        }`
        shader.fragmentShader = shader.fragmentShader.replace(
          `#include <color_fragment>`,
          `${this._bodyFragmentShader.trim()}`
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

    this.renderable = new Mesh(geo, mat)

    this.add(this.renderable)
  }
  //

  set headerVertexShader(v) {
    this._headerVertexShader = v
    this.sync()
  }
  get headerVertexShader() {
    return this._headerVertexShader
  }
  set bodyVertexShaderPosition(v) {
    this._bodyVertexShaderPosition = v
    this.sync()
  }
  get bodyVertexShaderPosition() {
    return this._bodyVertexShaderPosition
  }
  set bodyVertexShaderNormal(v) {
    this._bodyVertexShaderNormal = v
    this.sync()
  }
  get bodyVertexShaderNormal() {
    return this._bodyVertexShaderNormal
  }
  //

  set headerFragmentShader(v) {
    this._headerFragmentShader = v
    this.sync()
  }
  get headerFragmentShader() {
    return this._headerFragmentShader
  }
  set bodyFragmentShader(v) {
    this._bodyFragmentShader = v
    this.sync()
  }
  get bodyFragmentShader() {
    return this._bodyFragmentShader
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
        value: '#72ff00',
      },
      {
        _id: getID(),
        nodeID,

        name: 'emissiveColor',
        type: 'color',
        value: '#000000',
      },

      {
        id: getID(),
        nodeID,
        name: 'headerVertexShader',
        type: `glsl`,
        value: MyObject3D.headerVertexShader,
      },
      {
        id: getID(),
        nodeID,
        name: 'bodyVertexShaderPosition',
        type: `glsl`,
        value: MyObject3D.bodyVertexShaderPosition,
      },
      {
        id: getID(),
        nodeID,
        name: 'bodyVertexShaderNormal',
        type: `glsl`,
        value: MyObject3D.bodyVertexShaderNormal,
      },
      {
        id: getID(),
        nodeID,
        name: 'headerFragmentShader',
        type: `glsl`,
        value: MyObject3D.headerFragmentShader,
      },
      {
        id: getID(),
        nodeID,
        name: 'bodyFragmentShader',
        type: `glsl`,
        value: MyObject3D.bodyFragmentShader,
      },
    ],

    //
    shaders: [],

    //

    //
  }
}

export function effect({ node, mini, data }) {
  let myObject = new MyObject3D({
    tracker: mini.now.mounter,
    mini,
    itself: mini.now.itself,
  })

  //
  mini.now.scene.add(myObject)
  mini.onClean(() => {
    myObject.removeFromParent()
  })

  //
  data.uniforms.headerVertexShader((v) => {
    if (v && typeof v.value !== 'undefined') {
      myObject.headerVertexShader = v.value
    }
  })
  data.uniforms.bodyVertexShaderPosition((v) => {
    if (v && typeof v.value !== 'undefined') {
      myObject.bodyVertexShaderPosition = v.value
    }
  })

  data.uniforms.bodyVertexShaderNormal((v) => {
    if (v && typeof v.value !== 'undefined') {
      myObject.bodyVertexShaderNormal = v.value
    }
  })

  data.uniforms.headerFragmentShader((v) => {
    if (v && typeof v.value !== 'undefined') {
      myObject.headerFragmentShader = v.value
    }
  })

  data.uniforms.bodyFragmentShader((v) => {
    if (v && typeof v.value !== 'undefined') {
      myObject.bodyFragmentShader = v.value
    }
  })

  data.uniforms.tintColor((v) => {
    if (v && typeof v.value !== 'undefined') {
      myObject.tintColor = v.value
    }
  })

  data.uniforms.emissiveColor((v) => {
    if (v && typeof v.value !== 'undefined') {
      myObject.emissiveColor = v.value
    }
  })

  // node.out0.pulse(myObject)
}

//

//
