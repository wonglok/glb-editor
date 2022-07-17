import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'
import useStore from '@/helpers/store'
import { useEffect, useRef } from 'react'
import { SSRPass } from 'screen-space-reflections'
import * as POSTPROCESSING from 'postprocessing'
import {
  ACESFilmicToneMapping,
  Object3D,
  sRGBEncoding,
  Vector3,
  WebGLRenderer,
} from 'three'

export function Effect() {
  let { renderer, scene, camera } = useThree((s) => {
    return {
      renderer: s.gl,
      scene: s.scene,
      camera: s.camera,
    }
  })

  let rComposer = useRef()
  let shock = useRef()
  let pick = useRef()
  useEffect(() => {
    //

    let params = {
      enabled: true,
      floorRoughness: 1,
      floorNormalScale: 1,
      antialias: false,

      width: window.innerWidth,
      height: window.innerHeight,
      useBlur: true,
      blurKernelSize: POSTPROCESSING.KernelSize.SMALL,
      blurWidth: 935,
      blurHeight: 304,
      rayStep: 0.534,
      intensity: 1,
      power: 1,
      depthBlur: 0.11,
      enableJittering: false,
      jitter: 0.17,
      jitterSpread: 0.59,
      jitterRough: 0.8,
      roughnessFadeOut: 1,
      maxDepth: 1,
      thickness: 3.5,
      ior: 1.45,
      rayFadeOut: 0,
      MAX_STEPS: 25,
      NUM_BINARY_SEARCH_STEPS: 7,
      maxDepthDifference: 3,
      stretchMissedRays: false,
      useMRT: true,
      useNormalMap: true,
      useRoughnessMap: true,
    }

    const composer = new POSTPROCESSING.EffectComposer(renderer)
    rComposer.current = composer

    // render pass
    // --------
    // --------
    // --------
    // --------
    // --------
    // --------

    const renderPass = new POSTPROCESSING.RenderPass(scene, camera)
    composer.addPass(renderPass)

    // ssr pass
    // --------
    // --------
    // --------
    // --------
    // --------
    // --------
    // --------

    const ssrPass = new SSRPass(scene, camera, params)
    composer.addPass(ssrPass)

    // --------
    // --------
    // --------
    // --------
    // --------
    // --------
    const depthPickingPass = new POSTPROCESSING.DepthPickingPass()
    pick.current = depthPickingPass

    composer.addPass(depthPickingPass)

    // --------
    // --------
    // --------
    // --------
    // --------
    // --------

    const shockWaveEffect = new POSTPROCESSING.ShockWaveEffect(camera, target, {
      speed: 1.25,
      maxRadius: 0.25,
      waveSize: 0.125,
      amplitude: 0.05,
    })
    shock.current = shockWaveEffect

    const effectPass = new POSTPROCESSING.EffectPass(camera, shockWaveEffect)

    composer.addPass(effectPass)

    let target = new Vector3()
    let ndc = new Vector3()
    let handlers = {
      /**
       * Picks depth using the given pointer coordinates.
       *
       * @private
       * @param {PointerEvent} event - An event.
       */

      async pickDepth(event) {
        ndc.x = (event.clientX / window.innerWidth) * 2.0 - 1.0
        ndc.y = -(event.clientY / window.innerHeight) * 2.0 + 1.0

        ndc.z = await depthPickingPass.readDepth(ndc)
        ndc.z = ndc.z * 2.0 - 1.0

        // Convert from NDC to world position.
        cursor.position.copy(ndc.unproject(camera))
      },
      /**
       * Handles keyboard events.
       *
       * @private
       * @param {Event} event - An event.
       */

      handleKeyboardEvent(event) {
        if (event.key === 'e') {
          explode()
        }
      },

      handleEvent(event) {
        switch (event.type) {
          case 'mousemove':
            handlers.pickDepth(event)
            break

          case 'keyup':
            handlers.handleKeyboardEvent(event)
            break
        }
      },
    }

    let cursor = new Object3D()
    document.addEventListener('keyup', handlers.handleEvent)
    renderer.domElement.addEventListener('mousemove', handlers.handleEvent, {
      passive: true,
    })
    renderer.domElement.addEventListener('click', () => {
      explode()
    })

    let explode = (at = cursor.position) => {
      shockWaveEffect.epicenter.copy(at)
      shockWaveEffect.explode()
    }
  }, [])

  useFrame(() => {
    if (rComposer.current) {
      rComposer.current.render()
    }
  }, 10000)
  return null
}
