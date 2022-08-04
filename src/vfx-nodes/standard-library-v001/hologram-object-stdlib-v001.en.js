import { getID } from '@/vfx-runtime/ENUtils'
import { BoxBufferGeometry, SphereBufferGeometry } from 'three'
import { Color, Mesh, MeshPhysicalMaterial, Object3D } from 'three140'

class MyObject3D extends Object3D {
  static headerVertexShader = `

varying float vH;
uniform float time;

`

  static bodyVertexShader = `

float sizer = (0.5 + 0.5 * sin(position.z * 6.0 +  5.0 * time)) * 1.0 + 0.1;
vec3 transformed = vec3( position );
transformed.xy *= sizer;
vH = sizer;

vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif
`

  static headerFragmentShader = `

varying float vH;
uniform float time;

`
  static bodyFragmentShader = `

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
    // this._headerVertexShader = ''
    // this._bodyVertexShader = ''
    // this._headerFragmentShader = ''
    // this._bodyFragmentShader = ''

    this._headerVertexShader = '' + MyObject3D.headerVertexShader
    this._bodyVertexShader = '' + MyObject3D.bodyVertexShader
    this._headerFragmentShader = '' + MyObject3D.headerFragmentShader
    this._bodyFragmentShader = '' + MyObject3D.bodyFragmentShader

    //
    this._tintColor = new Color('#ffffff')
    this._emissiveColor = new Color('#ffffff')

    let geo = new SphereBufferGeometry(1, 128, 128)
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
          `${this._headerVertexShader.trim()}
          void main() {`
        )
        shader.vertexShader = shader.vertexShader.replace(
          `#include <begin_vertex>`,
          `${this._bodyVertexShader}`
        )
        shader.vertexShader = shader.vertexShader.replace(
          `#include <beginnormal_vertex>`,
          ``
        )
        shader.fragmentShader = `${this._headerFragmentShader.trim()}\n${
          shader.fragmentShader
        }`
        shader.fragmentShader = shader.fragmentShader.replace(
          `#include <dithering_fragment>`,
          `#include <dithering_fragment>\n${this._bodyFragmentShader.trim()}`
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

  set headerVertexShader(v) {
    this._headerVertexShader = v
    this.sync()
  }
  get headerVertexShader() {
    return this._headerVertexShader
  }
  set bodyVertexShader(v) {
    this._bodyVertexShader = v
    this.sync()
  }
  get bodyVertexShader() {
    return this._bodyVertexShader
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
        name: 'headerVertexShader',
        type: `glsl`,
        value: MyObject3D.headerVertexShader,
      },
      {
        id: getID(),
        nodeID,
        name: 'bodyVertexShader',
        type: `glsl`,
        value: MyObject3D.bodyVertexShader,
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

  data.uniforms.headerVertexShader((v) => {
    if (v && typeof v.value !== 'undefined') {
      myItem.headerVertexShader = v.value
    }
  })
  data.uniforms.bodyVertexShader((v) => {
    if (v && typeof v.value !== 'undefined') {
      myItem.bodyVertexShader = v.value
    }
  })

  data.uniforms.headerFragmentShader((v) => {
    if (v && typeof v.value !== 'undefined') {
      myItem.headerFragmentShader = v.value
    }
  })

  data.uniforms.bodyFragmentShader((v) => {
    if (v && typeof v.value !== 'undefined') {
      myItem.bodyFragmentShader = v.value
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
