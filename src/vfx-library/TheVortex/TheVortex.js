import {
  BoxBufferGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  DataTexture,
  DoubleSide,
  FloatType,
  Object3D,
  Points,
  RGBAFormat,
  ShaderMaterial,
  Vector3,
  Mesh,
  InstancedMesh,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  IcosahedronBufferGeometry,
  MeshPhysicalMaterial,
  FrontSide,
  PointLight,
} from 'three'
import { CustomGPU } from './CustomGPU'
import { vortexComputeShader } from './computeShader'
import { NoodleO3 } from './NoodleO3'
import { Core } from '@/vfx-core/Core'

export class TheVortex extends Object3D {
  set shader(v) {
    this._shader = v
    this.setSimShader(v)
  }
  get shader() {
    return this.a
  }
  constructor({ enableDetection } = {}) {
    super()
    this._shader = ''
    this.setSimShader = () => {}

    this.core = Core.makeDisposableNode({ name: 'vortex' }).sub
    let gl = Core.now.canvas.now.gl

    let SIZE_X = 128
    let SIZE_Y = 128

    let gpuCompute = new CustomGPU(SIZE_X, SIZE_Y, gl)
    //
    gpuCompute.setDataType(FloatType)

    let ptLight = new PointLight(0xff00ff, 32.5, 25)
    this.add(ptLight)

    // pos IDX
    let posIdx_data = new Float32Array(SIZE_X * SIZE_Y * 4)
    let posIdx = new DataTexture(
      posIdx_data,
      SIZE_X,
      SIZE_Y,
      RGBAFormat,
      FloatType
    )
    let p

    p = 0
    for (let j = 0; j < SIZE_X; j++) {
      for (let i = 0; i < SIZE_Y; i++) {
        let id = p / 4
        posIdx_data[p + 0] = id % 6 // square 1 / 6 index
        posIdx_data[p + 1] = Math.floor(id / 6) // square
        posIdx_data[p + 2] = (SIZE_Y * SIZE_X) / 6.0 // total
        posIdx_data[p + 3] = id
        p += 4
      }
    }

    // pos IDX
    let posDynamic_data = new Float32Array(SIZE_X * SIZE_Y * 4)
    let posDynamic = new DataTexture(
      posDynamic_data,
      SIZE_X,
      SIZE_Y,
      RGBAFormat,
      FloatType
    )

    p = 0
    for (let j = 0; j < SIZE_Y; j++) {
      for (let i = 0; i < SIZE_X; i++) {
        posDynamic_data[p + 0] = 0
        posDynamic_data[p + 1] = 0
        posDynamic_data[p + 2] = 0
        posDynamic_data[p + 3] = 1.0
        p += 4
      }
    }

    let tPos = vortexComputeShader

    //   tPos = `
    //   // uniform sampler2D tPos;
    //   ${tPos}
    // `

    let posVar = gpuCompute.addVariable('tPos', tPos, posDynamic)

    posVar.material.uniforms.tIdx = { value: posIdx }
    posVar.material.uniforms.iTime = { value: 0 }
    posVar.material.uniforms.mousePos = { value: new Vector3(0, 0, 0) }
    posVar.material.uniforms.screen = {
      value: new Vector3(window.innerWidth, window.innerHeight, 0.0),
    }
    posVar.material.uniforms.enterCirlce = { value: 0 }

    this.setSimShader = (code) => {
      let str =
        `
      uniform sampler2D tPos;
      ` +
        tPos +
        ''

      str = str.replace('/*insert_here*/', code)

      let mat = gpuCompute.createShaderMaterial(str, posVar.material.uniforms)

      // console.log(mat)

      posVar.material = mat
      posVar.material.needsUpdate = true

      // console.log(code)
      //
    }

    let vp = new Vector3()

    // if (enableDetection) {
    //   this.core.onLoop(() => {posVar.material.uniforms
    //     this.getWorldPosition(vp)
    //     if (Core.now?.walker) {
    //       let dist = Core.now.walker.params.player.position.distanceTo(vp)
    //       if (dist <= 14.0) {
    //         posVar.material.uniforms.enterCirlce.value = 1
    //       } else {
    //         posVar.material.uniforms.enterCirlce.value = 0
    //       }
    //     }
    //   })
    // }

    gpuCompute.setVariableDependencies(posVar, [posVar])

    let error = gpuCompute.init()
    if (error !== null) {
      console.error(error)
    }
    let boxGeo = new IcosahedronBufferGeometry(1.0, 0.0).toNonIndexed()

    let geo = new InstancedBufferGeometry()
    geo.setAttribute('position', boxGeo.attributes.position)
    geo.setAttribute('normal', boxGeo.attributes.normal)
    geo.instanceCount = SIZE_X * SIZE_Y

    let getUVInfo = () => {
      let newArr = []
      let na = 0
      for (let j = 0; j < SIZE_Y; j++) {
        for (let i = 0; i < SIZE_X; i++) {
          newArr[na + 0] = i / SIZE_X
          newArr[na + 1] = j / SIZE_Y
          newArr[na + 2] = 0
          na += 3
        }
      }
      return newArr
    }

    geo.setAttribute(
      'uvinfo',
      new InstancedBufferAttribute(new Float32Array(getUVInfo()), 3, true, 1)
    )
    // geo.setAttribute(
    //   'posIdx',
    //   new BufferAttribute(new Float32Array(posIdx.image.data), 4)
    // )

    // enableDetection

    // let uniforms = {
    //   color: { value: new Color('#58519B').offsetHSL(0, 0.0, 0.0) },
    //   time: { value: 0 },
    //   tPos: { value: null },
    // }
    // let material = new ShaderMaterial({
    //   transparent: true,
    //   uniforms,
    //   defines: {
    //     resolution: `vec2(${SIZE_X.toFixed(1)}, ${SIZE_Y.toFixed(1)})`,
    //   },
    //   vertexShader: /* glsl */ `
    // uniform  sampler2D tPos;
    // #include <common>
    // // uniform sampler2D tIdx;

    // varying vec3 v_tt;

    // attribute vec3 uvinfo;

    // void main() {
    //   // vec3 newPos = vec3(1.0);

    //   // position is changed to host uv vals
    //   vec4 tt = texture2D(tPos, uvinfo.xy);
    //   // vec4 idx = texture2D(tIdx, position.xy);

    //   v_tt = normalize(tt.xyz);

    //   vec4 mvPosition = modelViewMatrix * (vec4(tt.rgb + position * 3.0, 1.0));
    //   vec4 outputPos = projectionMatrix * mvPosition;

    //   gl_Position = outputPos;
    // }
    // `,
    //   fragmentShader: /* glsl */ `
    // #include <common>

    // varying vec3 v_tt;

    // uniform vec3 color;

    // void main () {
    //   gl_FragColor = vec4(
    //     vec3(color.x + 0.2 * (v_tt.x),
    //     color.y + 0.2 * (v_tt.y),
    //     color.z + 0.2 * (v_tt.z))  * 3.0  + 0.3
    //     ,
    //     0.35
    //   );

    //   // if (length(gl_PointCoord.xy - 0.5) <= 0.5) {

    //   // } else {
    //   //   discard;
    //   // }
    // }

    // `,
    //   side: FrontSide,
    // })

    //uvinfo

    //

    let getMat = (code) => {
      let matt = new MeshPhysicalMaterial({
        color: new Color('#ff00ff'),
        transparent: true,
        roughness: 0.0,
        metalness: 1.0,
      })
      matt.onBeforeCompile = (shader, gl) => {
        //
        shader.uniforms.time = { value: null }
        this.core.onLoop((dt) => {
          let time = window.performance.now() / 1000
          shader.uniforms.time.value = time
          // posVar.material.uniforms.iTime.value = time

          // uniforms.tPos.value = gpuCompute.getCurrentRenderTarget(posVar).texture
          // uniforms.time.value = time
          // current.texture = uniforms.tPos.value
        })

        shader.uniforms.tPos = { value: null }
        shader.uniforms.tPos2 = { value: null }
        this.core.onLoop(() => {
          shader.uniforms.tPos.value =
            gpuCompute.getCurrentRenderTarget(posVar).texture

          shader.uniforms.tPos2.value =
            gpuCompute.getAlternateRenderTarget(posVar).texture
        })

        shader.vertexShader = shader.vertexShader.replace(
          `void main() {`,
          /* glsl */ `
      uniform sampler2D tPos;
      uniform sampler2D tPos2;
      attribute vec3 uvinfo;

      uniform float time;


      mat3 rotateX(float rad) {
          float c = cos(rad);
          float s = sin(rad);
          return mat3(
              1.0, 0.0, 0.0,
              0.0, c, s,
              0.0, -s, c
          );
      }

      mat3 rotateY(float rad) {
          float c = cos(rad);
          float s = sin(rad);
          return mat3(
              c, 0.0, -s,
              0.0, 1.0, 0.0,
              s, 0.0, c
          );
      }

      mat3 rotateZ(float rad) {
          float c = cos(rad);
          float s = sin(rad);
          return mat3(
              c, s, 0.0,
              -s, c, 0.0,
              0.0, 0.0, 1.0
          );
      }

      mat3 rotateQ (vec3 axis, float rad) {
          float hr = rad / 2.0;
          float s = sin( hr );
          vec4 q = vec4(axis * s, cos( hr ));
          vec3 q2 = q.xyz + q.xyz;
          vec3 qq2 = q.xyz * q2;
          vec2 qx = q.xx * q2.yz;
          float qy = q.y * q2.z;
          vec3 qw = q.w * q2.xyz;

          return mat3(
              1.0 - (qq2.y + qq2.z),  qx.x - qw.z,            qx.y + qw.y,
              qx.x + qw.z,            1.0 - (qq2.x + qq2.z),  qy - qw.x,
              qx.y - qw.y,            qy + qw.x,              1.0 - (qq2.x + qq2.y)
          );
      }

      mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
        vec3 rr = vec3(sin(roll), cos(roll), 0.0);
        vec3 ww = normalize(target - origin);
        vec3 uu = normalize(cross(ww, rr));
        vec3 vv = normalize(cross(uu, ww));

        return mat3(uu, vv, ww);
      }

      void main() {`
        )

        //
        shader.vertexShader = shader.vertexShader.replace(
          `#include <begin_vertex>`,
          /* glsl */ `
        //

        vec4 tt = texture2D(tPos, uvinfo.xy);
        vec4 tt2 = texture2D(tPos2, uvinfo.xy);

        vec3 pos = position;

        vec3 diff = normalize(tt2.rgb - tt.rgb);

        pos = pos * calcLookAtMatrix(pos + tt2.rgb, pos + tt.rgb, 1.0);

        // pos *= rotateX(length(tt.rgb - tt2.rgb) / 2.0);
        // pos *= rotateY(length(tt.rgb - tt2.rgb) / 2.0);
        // pos *= rotateZ(length(tt.rgb - tt2.rgb) / 2.0);


        vec3 transformed = vec3( tt.rgb + pos );
      `
        )

        // let transformV3 = `
        //       vec3 nPos = position;
        //       vec3 transformed = vec3( nPos );
        //       `

        let transformV3Normal = `

            vec3 nPosNormal = normalize(normal);
            vec3 objectNormal = vec3( nPosNormal );

            // #ifdef USE_TANGENT
            //   vec3 objectTangent = vec3( tangent.xyz );
            // #endif
            `

        // shader.vertexShader = shader.vertexShader.replace(
        //   `#include <begin_vertex>`,
        //   `${transformV3}`
        // )

        shader.vertexShader = shader.vertexShader.replace(
          `#include <beginnormal_vertex>`,
          `${transformV3Normal}`
        )

        shader.fragmentShader = shader.fragmentShader.replace(
          `void main() {`,
          `${`

  `}\nvoid main() {`
        )
        shader.fragmentShader = shader.fragmentShader.replace(
          `#include <output_fragment>`,
          `
      #ifdef OPAQUE
        diffuseColor.a = 1.0;
      #endif
      #ifdef USE_TRANSMISSION
        diffuseColor.a *= transmissionAlpha + 0.1;
      #endif

      gl_FragColor = vec4( outgoingLight, diffuseColor.a );
      `
        )
      }
      return matt
    }

    let matt = getMat(this._shader || '')

    let renderable = new Mesh(geo, matt) // material

    renderable.frustumCulled = false
    renderable.scale.setScalar((1 / 350) * 50)
    renderable.userData.enableBloom = true

    // let renderable2 = new Mesh(geo, material2)
    // renderable2.frustumCulled = false
    // renderable2.userData.enableBloom = true
    // Core.now.canvas.now.scene.add(renderable2)
    //
    this.add(renderable)
    this.core.onClean(() => {
      renderable.removeFromParent()
    })

    let current = {
      texture: gpuCompute.getCurrentRenderTarget(posVar).texture,
    }
    this.core.onLoop((dt) => {
      let time = window.performance.now() / 1000

      // posVar.material.uniforms.iTime.value = time

      // uniforms.tPos.value = gpuCompute.getCurrentRenderTarget(posVar).texture
      // uniforms.time.value = time
      // current.texture = uniforms.tPos.value
      gpuCompute.compute()
    })

    let noodleO3 = new NoodleO3({
      node: this.core,
      getHeadList: () => current.texture,
      howManyTrackers: 128,
      tailLength: 128,
    })
    noodleO3.o3d.scale.setScalar((1 / 350) * 50)

    this.add(noodleO3.o3d)
    this.core.onClean(() => {
      this.remove(noodleO3.o3d)
    })
    this.core.onLoop((dt) => {
      noodleO3.track({ trackers: [], lerp: 1, dt })
    })

    //
    //
    //
    //
    //
  }
}
