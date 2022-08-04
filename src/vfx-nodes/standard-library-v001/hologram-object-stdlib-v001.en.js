import { Core } from '@/vfx-core/Core'
import { getID } from '@/vfx-runtime/ENUtils'
import { SphereBufferGeometry } from 'three'
import { Color, Mesh, MeshPhysicalMaterial, Object3D } from 'three140'

class MyObject3D extends Object3D {
  static headerVertexShader = `


varying float vH;
uniform float time;

`

  static bodyVertexShaderPosition = `
float sizer = (0.5 + 0.5 * sin(position.y * 3.14 * 5.0 +  5.0 * time)) * 0.1 + 0.9;
vec3 transformed = vec3( position );
transformed.xz *= sizer;
vH = sizer;
`

  static bodyVertexShaderNormal = `

vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif

float sizer2 = (0.5 + 0.5 * sin(position.y * 3.1415 * 5.0 +  5.0 * time)) * 0.1 + 0.9;
vec3 transformed2 = vec3( position );
transformed2.xy *= sizer2;

objectNormal = normalize(transformed2);

`

  static headerFragmentShader = `

varying float vH;
uniform float time;

`
  static bodyFragmentShader = `
float ratioA = abs(sin(vH * 50.0 * 3.141582));
float ratioB = abs(sin(vH * 50.0 * 3.141582));
float ratioC = abs(sin(vH * 50.0 * 3.141582));

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

    this.core = Core.makeDisposableNode({ name: 'hologram' }).sub
    this.core.onLoop(() => {
      this.position.set(0, 0, 0)
      tracker.updateMatrixWorld(true)
      this.position.applyMatrix4(tracker.matrixWorld)
      this.position.y += 1
    })

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
      name: itself.material.name,
      // map: itself.material.map,
      // roughnessMap: itself.material.roughnessMap,
      // metalnessMap: itself.material.metalnessMap,

      wireframe: false,
      color: this._tintColor,
      emissive: this._emissiveColor,
      metalness: 0.3,
      transmission: 1.0,
      ior: 1.4,
      roughness: 0.0,
      thickness: 4,
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

        shader.vertexShader = shader.vertexShader.replace(
          `#include <beginnormal_vertex>`,
          `${this._bodyVertexShaderNormal}`
        )

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

        name: 'metalness',
        type: 'float',
        value: 0,
      },
      {
        _id: getID(),
        nodeID,

        name: 'roughness',
        type: 'float',
        value: 0,
      },
      {
        _id: getID(),
        nodeID,

        name: 'transmission',
        type: 'float',
        value: 0,
      },
      {
        _id: getID(),
        nodeID,

        name: 'thickness',
        type: 'float',
        value: 1,
      },
      {
        _id: getID(),
        nodeID,

        name: 'ior',
        type: 'float',
        value: 1,
      },
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

  data.uniforms.metalness((v) => {
    if (v && typeof v.value !== 'undefined') {
      myObject.mat.metalness = v.value
    }
  })

  data.uniforms.roughness((v) => {
    if (v && typeof v.value !== 'undefined') {
      myObject.mat.roughness = v.value
    }
  })

  data.uniforms.transmission((v) => {
    if (v && typeof v.value !== 'undefined') {
      myObject.mat.transmission = v.value
    }
  })

  data.uniforms.ior((v) => {
    if (v && typeof v.value !== 'undefined') {
      myObject.mat.ior = v.value
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
