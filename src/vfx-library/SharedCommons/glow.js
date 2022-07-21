import {
  //
  DoubleSide,
  CircleBufferGeometry,
  Vector3,
  RepeatWrapping,
  TextureLoader,
  Mesh,
  MeshStandardMaterial,
  sRGBEncoding,

  //
  Clock,
  Color,
  Vector2,
  ShaderMaterial,
  MeshBasicMaterial,
  Layers,
  LineBasicMaterial,
  Material,
  WebGLRenderTarget,
} from 'three'

//

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { UnrealBloomPass } from './UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
// import { InstancedMesh } from 'three'
// import { Points } from 'three'
// import { MeshLambertMaterial } from 'three'
// import { MeshPhysicalMaterial } from 'three'
// import { MeshPhongMaterial } from 'three'
// import { MeshMatcapMaterial } from 'three'
// import { MeshToonMaterial } from 'three'
// import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { Scene } from 'three'
import { FlowerSim } from './FlowerSim.js'
import { Core } from '@/vfx-core/Core.js'
// import { PerspectiveCamera } from 'three'
// import { OrthographicCamera } from 'three'
// import { PlaneGeometry } from 'three'
// import { GeoShader } from 'vfx-library/GeoShader/GeoShader.js'
// import { TheVortex } from 'vfx-library/TheVortex/TheVortex.js'
//

export const ENTIRE_SCENE = 0
export const BLOOM_SCENE = 1

export const enableBloom = (item) => {
  item.layers.enable(BLOOM_SCENE)
}

export const disableBloom = (item) => {
  item.layers.disable(BLOOM_SCENE)
}

/**
 * @param {Object} props - The props stuff
 * @param {IOParams} props.io - The sockets
 */
export async function glow({ vfx }) {
  // let tool = useTools();

  let gl = vfx.now.gl
  let renderer = gl
  let scene = vfx.now.scene
  let camera = vfx.now.camera
  let size = new Vector2()

  let dpr = window.devicePixelRatio
  let samller = dpr
  if (dpr === 1) {
    samller = 1
  } else {
    samller = dpr * 0.5
  }
  renderer.getSize(size)
  size.multiplyScalar(samller)

  let bloomComposer = new EffectComposer(gl)
  bloomComposer.renderToScreen = false

  let renderPass = new RenderPass(scene, camera)
  bloomComposer.addPass(renderPass)

  //
  let unrealPass = new UnrealBloomPass(size, 1.0, 0.5, 0.5)
  unrealPass.renderToScreen = true

  // unrealPass.strength = 1.0;
  // let audio = ({ detail: { low, mid, high, texture } }) => {
  //   if (low !== 0) {
  //     unrealPass.strength = 3 * (low + mid + high);
  //   }
  // };
  // window.addEventListener("audio-info", audio);
  // window.removeEventListener("audio-info", audio);

  unrealPass.strength = 0.85
  unrealPass.threshold = 0.05
  unrealPass.radius = 0.4

  //
  window.Core = Core

  //
  Core.onChange('bloomStrength', (v) => {
    unrealPass.strength = v
  })
  Core.onChange('bloomThreshold', (v) => {
    unrealPass.threshold = v
  })
  Core.onChange('bloomRadius', (v) => {
    unrealPass.radius = v
  })

  const finalComposer = new EffectComposer(gl)
  finalComposer.addPass(renderPass)

  finalComposer.renderToScreen = true

  vfx.now.finalComposer = finalComposer

  vfx.onResize(() => {
    // let dpr = renderer.getPixelRatio()
    let sizeV2 = new Vector2()
    renderer.getSize(sizeV2)
    bloomComposer.setSize(sizeV2.x, sizeV2.y)
    finalComposer.setSize(sizeV2.x, sizeV2.y)
    unrealPass.setSize(sizeV2.x, sizeV2.y)

    let goSetPixelRatio = (dpr) => {
      bloomComposer.setPixelRatio(dpr)
      finalComposer.setPixelRatio(dpr)
      renderer.setPixelRatio(dpr)
    }

    if (Core.now.renderMode === 'loading') {
      if (window.devicePixelRatio === 1) {
        goSetPixelRatio(1)
      } else {
        goSetPixelRatio(window.devicePixelRatio)
      }
    } else if (Core.now.renderMode === 'slow') {
      if (window.devicePixelRatio === 1) {
        goSetPixelRatio(1)
      } else {
        let dpr = window.devicePixelRatio

        if (dpr === 1) {
          samller = 1
        } else {
          samller = dpr * 0.5
        }
        goSetPixelRatio(samller)
      }
    } else if (Core.now.renderMode === 'slowhd') {
      goSetPixelRatio(window.devicePixelRatio || 1)
    } else if (Core.now.renderMode === 'slowhq') {
      goSetPixelRatio(window.devicePixelRatio || 1)
    } else if (Core.now.renderMode === 'hd') {
      let dpr = window.devicePixelRatio
      if (dpr === 1) {
        samller = 1
      } else {
        samller = dpr * 0.75
      }
      goSetPixelRatio(samller)
    } else if (Core.now.renderMode === 'hq') {
      let dpr = window.devicePixelRatio
      let samller = dpr
      if (dpr === 1) {
        samller = 1
      } else {
        samller = dpr * 0.75
      }
      goSetPixelRatio(samller)
    }
  })

  // let myClock = new Clock()
  // let tick = 0
  // Core.onLoop((dt) => {
  //   let fps = 1.0 / myClock.getDelta()
  //   if (fps <= 20) {
  //     tick++
  //   }
  //   if (tick >= 100) {
  //     Core.now.slowMode = true
  //   }
  // })

  bloomComposer.addPass(unrealPass)

  // bloomComposer.renderTarget2.texture.encoding = sRGBEncoding;
  // bloomComposer.renderTarget1.texture.encoding = sRGBEncoding;
  // finalComposer.renderTarget2.texture.encoding = sRGBEncoding;
  // finalComposer.renderTarget1.texture.encoding = sRGBEncoding;

  //
  //
  // let bloomTexture = {
  //   value: bloomComposer.renderTarget2.texture,
  // };

  let time = {
    value: 0,
  }

  let drunkMode = {
    value: 1,
  }

  let energyMode = {
    value: 1,
  }

  let resolution = {
    value: new Vector2(window.innerWidth, window.innerHeight),
  }
  Core.now.drunkMode = false
  Core.onLoop((dt) => {
    time.value += dt
    let dpr = window.devicePixelRatio || 1.0
    resolution.value.set(window.innerWidth * dpr, window.innerHeight * dpr)
    energyMode.value = Core.now.energyMode ? 1.0 : 0.0
    drunkMode.value = Core.now.drunkMode === true ? 1.0 : 0.0
  })

  const finalPass = new ShaderPass(
    new ShaderMaterial({
      transparent: true,
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: {
          value: bloomComposer.renderTarget2.texture,
        },
        hud: {
          value: new TextureLoader().load(`/postproc/hud.png`, (t) => {
            t.encoding = sRGBEncoding
            window.dispatchEvent(new CustomEvent('resize'))
          }),
        },
        dudv: {
          // public
          value: new TextureLoader().load(`/postproc/NormalMap.png`, (t) => {
            // value: new TextureLoader().load(`/postproc/NormalMap.png`, (t) => {
            t.encoding = sRGBEncoding
            t.wrapS = t.wrapT = RepeatWrapping
          }),
        },
        drunkMode,
        energyMode,
        time,
        resolution,
      },
      vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
        `,
      fragmentShader: /* glsl */ `
      uniform highp sampler2D baseTexture;
      uniform highp sampler2D bloomTexture;
      uniform sampler2D hud;
      uniform sampler2D dudv;

          uniform vec2 resolution;
          varying vec2 vUv;
          uniform float drunkMode;
          uniform float energyMode;
          uniform float time;
          const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

          float noise( in vec2 p ) {
            return sin(p.x)*sin(p.y);
          }

          float fbm4( vec2 p ) {
              float f = 0.0;
              f += 0.5000 * noise( p ); p = m * p * 2.02;
              f += 0.2500 * noise( p ); p = m * p * 2.03;
              f += 0.1250 * noise( p ); p = m * p * 2.01;
              f += 0.0625 * noise( p );
              return f / 0.9375;
          }

          float fbm6( vec2 p ) {
              float f = 0.0;
              f += 0.500000*(0.5 + 0.5 * noise( p )); p = m*p*2.02;
              f += 0.250000*(0.5 + 0.5 * noise( p )); p = m*p*2.03;
              f += 0.125000*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
              f += 0.062500*(0.5 + 0.5 * noise( p )); p = m*p*2.04;
              f += 0.031250*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
              f += 0.015625*(0.5 + 0.5 * noise( p ));
              return f/0.96875;
          }

          float pattern (vec2 p) {
            float vout = fbm4( p + time + fbm6(  p + fbm4( p + time )) );
            return abs(vout);
          }

          #include <common>

          void main() {

            vec2 myUV = vUv;

            if (drunkMode == 1.0) {
              myUV.x += pattern(vUv * 2.0 + time) * 0.05;
              myUV.y += pattern(vUv * 2.0 - time) * 0.05;
            }

            vec2 mySquareUV = myUV;
            if (resolution.x > resolution.y) {
              mySquareUV.x = myUV.x * resolution.x / resolution.y;

              mySquareUV.x = mySquareUV.x + 0.5;
              mySquareUV.x += -resolution.x / resolution.y / 2.0;
            } else if (resolution.x < resolution.y) {
              mySquareUV.y = myUV.y * resolution.y / resolution.x;

              mySquareUV.y = mySquareUV.y + 0.5;
              mySquareUV.y += -resolution.y / resolution.x / 2.0;
            }

            vec4 dudvCol = vec4(1.0);

            // if (energyMode == 1.0 || true) {
            //   // dudvCol = texture2D( dudv, vec2( mod(2.0 * mySquareUV.x - time * 0.3, 1.0),  mod(2.0 * mySquareUV.y - time * 0.0, 1.0)) ) ;
            //   dudvCol = texture2D( dudv, vec2( mod(2.0 * mySquareUV.x - time * 0.3, 1.0),  mod(2.0 * mySquareUV.y - time * 0.0, 1.0)) ) ;
            // }

            vec4 glow =  texture2D( bloomTexture, myUV * (0.93 + 0.07 * dudvCol.yz) ) ;
            vec4 base =  texture2D( baseTexture, myUV * (0.93 + 0.07 * dudvCol.yz) ) ;
            vec4 hudColor =  vec4(0.0);

            // const float edgeDetectionQuality = 1.0;
            // const float invEdgeDetectionQuality = 1. / edgeDetectionQuality;
            // base = FxaaPixelShader(
            //     vUv,
            //     baseTexture,
            //     resolution,
            //     edgeDetectionQuality, // [0,1] contrast needed, otherwise early discard
            //     invEdgeDetectionQuality
            // );

            // if (energyMode == 1.0) {
            //   hudColor = texture2D( hud, mySquareUV ) ;
            //   hudColor = hudColor * (rand(vec2(0.0) + time * 2.0));
            // }

            vec4 col4 = LinearTosRGB(vec4(
              base.rgb + glow.rgb
              , base.a + glow.a ));
            gl_FragColor = col4;

          }
        `,
      defines: {},
    }),
    'baseTexture'
  )
  //

  finalPass.needsSwap = true
  finalComposer.addPass(finalPass)

  // window.addEventListener(
  //   "resize",
  //   () => {

  //   },

  //   //
  //   false
  // );

  Core.now.finalComposer = finalComposer
  Core.now.bloomComposer = bloomComposer

  Core.now.finalPassMaterial = finalPass.material

  window.dispatchEvent(new CustomEvent('resize'))

  // let materials = {};
  const darkMaterial = new MeshBasicMaterial({
    color: new Color('#000000'),
    // skinning: true,
    side: DoubleSide,
  })

  const bloomLayer = new Layers()
  bloomLayer.set(BLOOM_SCENE)

  let cacheMap = new Map()
  //
  function darkenNonBloomed(obj) {
    if (obj.material instanceof Array) {
      // console.log();

      obj.material.forEach((it) => {
        if (it.isMesh && bloomLayer.test(it.layers) === false) {
          // materials[it.uuid] = it.material;
          cacheMap.set(it.uuid, it.material)
          it.material = it.userData.darkMaterial || darkMaterial
        }
      })
    } else if (obj.material instanceof Material) {
      // if (
      //   obj.material instanceof MeshStandardMaterial ||
      //   obj.material instanceof LineBasicMaterial ||
      //   obj.material instanceof MeshPhongMaterial ||
      //   obj.material instanceof MeshBasicMaterial ||
      //   obj.material instanceof MeshLambertMaterial ||
      //   obj.material instanceof MeshMatcapMaterial ||
      //   obj.material instanceof MeshPhysicalMaterial ||
      //   obj.material instanceof MeshToonMaterial
      // ) {

      // if (obj.geometry) {
      //   if (
      //     obj.geometry.type === "PlaneGeometry" &&
      //     obj.geometry.parameters.width >= 1000 &&
      //     obj.geometry.parameters.height >= 1000
      //   ) {
      //     obj.visible = false;
      //   }
      // }

      if (obj.name === 'helper') {
        obj.userData.helperOrigVis = obj.visible
        obj.visible = false
      }

      if (obj.type === 'GridHelper') {
        obj.userData.helperOrigVis = obj.visible
        obj.visible = false
      }
      /*
      new GeoShader({})
      */

      // if (
      //   obj?.material?.userData?.forceBloom &&
      //   obj?.material?.bloomAPI?.forceBloom
      // ) {
      //   obj.material.bloomAPI.forceBloom();
      //   return;
      // }

      // if (obj?.material?.bloomAPI?.pixelScan) {
      //   obj.material.bloomAPI.pixelScan();
      //   return;
      // }

      // it.material.bloomAPI

      //
      if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
        // materials[obj.uuid] = obj.material;
        cacheMap.set(obj.uuid, obj.material)
        obj.material = obj.userData.darkMaterial || darkMaterial
      }
    }
    // }
  }

  function restoreMaterial(obj) {
    //
    if (obj.material instanceof Array) {
      // console.log();

      obj.material.forEach((it) => {
        if (it.isMesh && bloomLayer.test(it.layers) === false) {
          // materials[it.uuid] = it.material;
          cacheMap.set(it.uuid, it.material)
          it.material = it.userData.darkMaterial || darkMaterial
        }
      })
    } else if (obj.material instanceof Material) {
      if (obj.name === 'helper') {
        //
        obj.visible = obj.userData.helperOrigVis
      }
      if (obj.type === 'GridHelper') {
        obj.visible = obj.userData.helperOrigVis
      }

      // if (obj?.material?.bloomAPI?.restore) {
      //   obj.material.bloomAPI.restore();
      //   return;
      // }

      if (cacheMap.has(obj.uuid)) {
        obj.material = cacheMap.get(obj.uuid)
        cacheMap.delete(obj.uuid)
      }

      // if (materials[obj.uuid]) {
      //   obj.material = materials[obj.uuid];
      //   delete materials[obj.uuid];
      // }
    }
  }

  //
  //
  //
  Core.onChange(
    'renderMode',
    (renderMode) => {
      //
      window.dispatchEvent(new Event('resize'))
    },
    //
    { initFire: true }
  )

  // Core.now.renderMode = 'hd'
  // Core.now.loadingScene = new Scene()
  // let bgColor = new Color('#121212')
  // Core.now.loadingScene.background = bgColor

  // let t = 0
  // Core.onLoop((dt) => {
  //   t += dt * 0.1
  //   let r = Math.sin(t) * 2.0 - 1.0
  //   bgColor.setHSL(r, 0.65, 0.75)
  //   //
  // })
  // let postCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  // let postPlane = new PlaneGeometry(2, 2)
  // let uniforms = {
  //   time: { value: 0 },
  //   resolution: {
  //     value: new Vector2(1024, 1024),
  //   },
  // }
  // Core.onLoop((dt) => {
  //   uniforms.time.value += dt
  // })

  // let postMaterial = new ShaderMaterial({
  //   uniforms,
  //   transparent: false,
  //   fragmentShader: /* glsl */ `

  //   uniform vec2 resolution;
  //   uniform float time;
  //   const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

  //         float noise( in vec2 p ) {
  //           return sin(p.x)*sin(p.y);
  //         }

  //         float fbm4( vec2 p ) {
  //             float f = 0.0;
  //             f += 0.5000 * noise( p ); p = m * p * 2.02;
  //             f += 0.2500 * noise( p ); p = m * p * 2.03;
  //             f += 0.1250 * noise( p ); p = m * p * 2.01;
  //             f += 0.0625 * noise( p );
  //             return f / 0.9375;
  //         }

  //         float fbm6( vec2 p ) {
  //             float f = 0.0;
  //             f += 0.500000*(0.5 + 0.5 * noise( p )); p = m*p*2.02;
  //             f += 0.250000*(0.5 + 0.5 * noise( p )); p = m*p*2.03;
  //             f += 0.125000*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
  //             f += 0.062500*(0.5 + 0.5 * noise( p )); p = m*p*2.04;
  //             f += 0.031250*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
  //             f += 0.015625*(0.5 + 0.5 * noise( p ));
  //             return f/0.96875;
  //         }

  //         float pattern (vec2 p) {
  //           float vout = fbm4( p + time + fbm6(  p + fbm4( p + time )) );
  //           return abs(vout);
  //         }

  //     void main (void) {

  //       vec2 uv = gl_FragCoord.xy / resolution.xy;

  //       vec3 flow1 = vec3(
  //         pattern(uv.xy * 2.0 + -0.1 * cos(time * 0.05)),
  //         pattern(uv.xy * 2.0 +  0.0 * cos(time * 0.05)),
  //         pattern(uv.xy * 2.0 +  0.1 * cos(time * 0.05))
  //       );
  //       vec3 flow = vec3(
  //         pattern(flow1.xy * 2.0 + -0.1 * cos(time * 0.05)),
  //         pattern(flow1.xy * 2.0 +  0.0 * cos(time * 0.05)),
  //         pattern(flow1.xy * 2.0 +  0.1 * cos(time * 0.05))
  //       );
  //       gl_FragColor = vec4(1.0 - (1.0 - flow) * flow, 1.0);
  //       // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  //     }
  //   `,
  //   //
  //   //
  // })

  //

  // //
  // let postQuad = new Mesh(postPlane, postMaterial)
  // // Core.now.loadingScene = postQuad
  // Core.now.loadingScene.add(postQuad)
  // Core.now.loadingScene = new Scene()
  // Core.now.canvas.ready.scene.then(() => {
  //   Core.now.loadingScene.background = new Color('#000000')

  //   Core.now.loadingScene.add(new TheVortex())
  // })
  // Core.now.loadingCamera = postCamera || new PerspectiveCamera()

  // Core.now.renderMode = 'loading'
  Core.now.loadingCamera = Core.now.canvas.now.camera.clone()
  Core.now.loadingScene = new Scene()
  Core.now.loadingScene.background = new Color('#ffffff')

  Core.now.loadingCamera.position.z = 30
  Core.now.loadingCamera.position.y = 0
  Core.now.loadingCamera.position.x = 0

  let vtx = new FlowerSim({})
  Core.now.loadingScene.add(vtx)
  Core.now.loadingCamera.lookAt(vtx.position)
  Core.onLoop(() => {
    vtx.core.isPaused = Core.now.renderMode !== 'loading'
  })

  // let dpi = window.devicePixelRatio || 1.0
  // let bloomPass = new UnrealBloomPass(
  //   new Vector2(window.innerWidth, window.innerHeight),
  //   1.5,
  //   0.4,
  //   0.85
  // ) //1.0, 9, 0.5, 512);

  // bloomPass.strength = 0.85
  // bloomPass.threshold = 0.05
  // bloomPass.radius = 0.4

  // bloomPass.renderToScreen = true
  // let composer = new EffectComposer(gl)
  // composer.setSize(window.innerWidth, window.innerHeight)
  // composer.setPixelRatio(dpi)
  // let renderScene = new RenderPass(
  //   Core.now.loadingScene,
  //   Core.now.loadingCamera
  // )
  // composer.addPass(renderScene)
  // // composer.addPass( effectFXAA );
  // composer.addPass(bloomPass)

  //
  let run = (dt) => {
    if (Core.now.renderMode === 'loading') {
      Core.now.canvas.now.gl.setRenderTarget(null)
      Core.now.canvas.now.gl.shadowMap.enabled = false
      Core.now.loadingCamera.aspect = Core.now.canvas.now.camera.aspect
      Core.now.loadingCamera.updateProjectionMatrix()
      Core.now.canvas.now.gl.render(
        Core.now.loadingScene,
        Core.now.loadingCamera
      )
      // composer.render()
      return
    }

    if (Core.now.renderMode === 'slow') {
      Core.now.canvas.now.gl.shadowMap.enabled = false
      Core.now.canvas.now.gl.render(
        Core.now.canvas.now.scene,
        Core.now.canvas.now.camera
      )
      return
    }

    if (Core.now.renderMode === 'slowhq') {
      Core.now.canvas.now.gl.shadowMap.enabled = false
      Core.now.canvas.now.gl.render(
        Core.now.canvas.now.scene,
        Core.now.canvas.now.camera
      )
      return
    }

    let origBG = scene.background

    gl.shadowMap.enabled = false
    scene.background = null
    scene.traverse(darkenNonBloomed)
    bloomComposer.render(dt)
    //
    gl.shadowMap.enabled = true
    scene.background = origBG
    scene.traverse(restoreMaterial)
    finalComposer.render(dt)
  }

  let clock = new Clock()

  vfx.onLoop(() => {
    scene.traverse((it) => {
      if (it.name === 'helper') {
        it.traverse((sub) => {
          sub.userData.dispose = true
        })
      }

      if (it.material) {
        if (
          it.material.emissive &&
          it.material.emissive.getHex() > 0 &&
          it.material.emissiveIntensity > 0
        ) {
          enableBloom(it)
        }
        if (it.material.emissiveMap) {
          enableBloom(it)
        }

        if (it?.material?.userData?.enableBloom === true) {
          enableBloom(it)
        }
        if (it.userData.enableBloom === true) {
          enableBloom(it)
        }

        if (it.userData.forceBloom === 'glow') {
          enableBloom(it)
        }

        if (it.userData.forceBloom === 'dim') {
          disableBloom(it)
        }
      }
    })

    let dt = clock.getDelta()

    if (vfx.now.stopGlow) {
      renderer.render(scene, camera)
    } else {
      run(dt)
    }
  })

  return null
}

/*

			const float edgeDetectionQuality = .2;
			const float invEdgeDetectionQuality = 1. / edgeDetectionQuality;
			gl_FragColor = FxaaPixelShader(
					vUv,
					tDiffuse,
					resolution,
					edgeDetectionQuality, // [0,1] contrast needed, otherwise early discard
					invEdgeDetectionQuality
			);
*/
export let fxaa = /* glsl */ `
// FXAA 3.11 implementation by NVIDIA, ported to WebGL by Agost Biro (biro@archilogic.com)
	//----------------------------------------------------------------------------------
	// File:        es3-kepler\FXAA\assets\shaders/FXAA_DefaultES.frag
	// SDK Version: v3.00
	// Email:       gameworks@nvidia.com
	// Site:        http://developer.nvidia.com/
	//
	// Copyright (c) 2014-2015, NVIDIA CORPORATION. All rights reserved.
	//
	// Redistribution and use in source and binary forms, with or without
	// modification, are permitted provided that the following conditions
	// are met:
	//  * Redistributions of source code must retain the above copyright
	//    notice, this list of conditions and the following disclaimer.
	//  * Redistributions in binary form must reproduce the above copyright
	//    notice, this list of conditions and the following disclaimer in the
	//    documentation and/or other materials provided with the distribution.
	//  * Neither the name of NVIDIA CORPORATION nor the names of its
	//    contributors may be used to endorse or promote products derived
	//    from this software without specific prior written permission.
	//
	// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS ''AS IS'' AND ANY
	// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
	// PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
	// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
	// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
	// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	//
	//----------------------------------------------------------------------------------
	#ifndef FXAA_DISCARD
			//
			// Only valid for PC OpenGL currently.
			// Probably will not work when FXAA_GREEN_AS_LUMA = 1.
			//
			// 1 = Use discard on pixels which don't need AA.
			//     For APIs which enable concurrent TEX+ROP from same surface.
			// 0 = Return unchanged color on pixels which don't need AA.
			//
			#define FXAA_DISCARD 0
	#endif
	/*--------------------------------------------------------------------------*/
	#define FxaaTexTop(t, p) texture2D(t, p, -100.0)
	#define FxaaTexOff(t, p, o, r) texture2D(t, p + (o * r), -100.0)
	/*--------------------------------------------------------------------------*/
	#define NUM_SAMPLES 5
	// assumes colors have premultipliedAlpha, so that the calculated color contrast is scaled by alpha
	float contrast( vec4 a, vec4 b ) {
			vec4 diff = abs( a - b );
			return max( max( max( diff.r, diff.g ), diff.b ), diff.a );
	}
	/*============================================================================
									FXAA3 QUALITY - PC
	============================================================================*/
	/*--------------------------------------------------------------------------*/
	vec4 FxaaPixelShader(
			vec2 posM,
			sampler2D tex,
			vec2 fxaaQualityRcpFrame,
			float fxaaQualityEdgeThreshold,
			float fxaaQualityinvEdgeThreshold
	) {
			vec4 rgbaM = FxaaTexTop(tex, posM);
			vec4 rgbaS = FxaaTexOff(tex, posM, vec2( 0.0, 1.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaE = FxaaTexOff(tex, posM, vec2( 1.0, 0.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaN = FxaaTexOff(tex, posM, vec2( 0.0,-1.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaW = FxaaTexOff(tex, posM, vec2(-1.0, 0.0), fxaaQualityRcpFrame.xy);
			// . S .
			// W M E
			// . N .
			bool earlyExit = max( max( max(
					contrast( rgbaM, rgbaN ),
					contrast( rgbaM, rgbaS ) ),
					contrast( rgbaM, rgbaE ) ),
					contrast( rgbaM, rgbaW ) )
					< fxaaQualityEdgeThreshold;
			// . 0 .
			// 0 0 0
			// . 0 .
			#if (FXAA_DISCARD == 1)
					if(earlyExit) FxaaDiscard;
			#else
					if(earlyExit) return rgbaM;
			#endif
			float contrastN = contrast( rgbaM, rgbaN );
			float contrastS = contrast( rgbaM, rgbaS );
			float contrastE = contrast( rgbaM, rgbaE );
			float contrastW = contrast( rgbaM, rgbaW );
			float relativeVContrast = ( contrastN + contrastS ) - ( contrastE + contrastW );
			relativeVContrast *= fxaaQualityinvEdgeThreshold;
			bool horzSpan = relativeVContrast > 0.;
			// . 1 .
			// 0 0 0
			// . 1 .
			// 45 deg edge detection and corners of objects, aka V/H contrast is too similar
			if( abs( relativeVContrast ) < .3 ) {
					// locate the edge
					vec2 dirToEdge;
					dirToEdge.x = contrastE > contrastW ? 1. : -1.;
					dirToEdge.y = contrastS > contrastN ? 1. : -1.;
					// . 2 .      . 1 .
					// 1 0 2  ~=  0 0 1
					// . 1 .      . 0 .
					// tap 2 pixels and see which ones are "outside" the edge, to
					// determine if the edge is vertical or horizontal
					vec4 rgbaAlongH = FxaaTexOff(tex, posM, vec2( dirToEdge.x, -dirToEdge.y ), fxaaQualityRcpFrame.xy);
					float matchAlongH = contrast( rgbaM, rgbaAlongH );
					// . 1 .
					// 0 0 1
					// . 0 H
					vec4 rgbaAlongV = FxaaTexOff(tex, posM, vec2( -dirToEdge.x, dirToEdge.y ), fxaaQualityRcpFrame.xy);
					float matchAlongV = contrast( rgbaM, rgbaAlongV );
					// V 1 .
					// 0 0 1
					// . 0 .
					relativeVContrast = matchAlongV - matchAlongH;
					relativeVContrast *= fxaaQualityinvEdgeThreshold;
					if( abs( relativeVContrast ) < .3 ) { // 45 deg edge
							// 1 1 .
							// 0 0 1
							// . 0 1
							// do a simple blur
							return mix(
									rgbaM,
									(rgbaN + rgbaS + rgbaE + rgbaW) * .25,
									.4
							);
					}
					horzSpan = relativeVContrast > 0.;
			}
			if(!horzSpan) rgbaN = rgbaW;
			if(!horzSpan) rgbaS = rgbaE;
			// . 0 .      1
			// 1 0 1  ->  0
			// . 0 .      1
			bool pairN = contrast( rgbaM, rgbaN ) > contrast( rgbaM, rgbaS );
			if(!pairN) rgbaN = rgbaS;
			vec2 offNP;
			offNP.x = (!horzSpan) ? 0.0 : fxaaQualityRcpFrame.x;
			offNP.y = ( horzSpan) ? 0.0 : fxaaQualityRcpFrame.y;
			bool doneN = false;
			bool doneP = false;
			float nDist = 0.;
			float pDist = 0.;
			vec2 posN = posM;
			vec2 posP = posM;
			int iterationsUsed = 0;
			int iterationsUsedN = 0;
			int iterationsUsedP = 0;
			for( int i = 0; i < NUM_SAMPLES; i++ ) {
					iterationsUsed = i;
					float increment = float(i + 1);
					if(!doneN) {
							nDist += increment;
							posN = posM + offNP * nDist;
							vec4 rgbaEndN = FxaaTexTop(tex, posN.xy);
							doneN = contrast( rgbaEndN, rgbaM ) > contrast( rgbaEndN, rgbaN );
							iterationsUsedN = i;
					}
					if(!doneP) {
							pDist += increment;
							posP = posM - offNP * pDist;
							vec4 rgbaEndP = FxaaTexTop(tex, posP.xy);
							doneP = contrast( rgbaEndP, rgbaM ) > contrast( rgbaEndP, rgbaN );
							iterationsUsedP = i;
					}
					if(doneN || doneP) break;
			}
			if ( !doneP && !doneN ) return rgbaM; // failed to find end of edge
			float dist = min(
					doneN ? float( iterationsUsedN ) / float( NUM_SAMPLES - 1 ) : 1.,
					doneP ? float( iterationsUsedP ) / float( NUM_SAMPLES - 1 ) : 1.
			);
			// hacky way of reduces blurriness of mostly diagonal edges
			// but reduces AA quality
			dist = pow(dist, .5);
			dist = 1. - dist;
			return mix(
					rgbaM,
					rgbaN,
					dist * .5
			);
	}


`
