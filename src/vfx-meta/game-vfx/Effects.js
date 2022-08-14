import { useFrame, useLoader, useThree } from '@react-three/fiber'
import {
  EffectComposer,
  SSR,
  Bloom,
  LUT,
  DepthOfField,
  Noise,
} from '@react-three/postprocessing'
// import { useControls } from 'leva'
import { LUTCubeLoader } from 'postprocessing'
import { useRender } from '../store/use-render'

// let settings = {
//   enabled: true,
//   temporalResolve: true,
//   STRETCH_MISSED_RAYS: true,
//   USE_MRT: true,
//   USE_NORMALMAP: true,
//   USE_ROUGHNESSMAP: true,
//   ENABLE_JITTERING: true,
//   ENABLE_BLUR: true,
//   DITHERING: false,
//   temporalResolveMix: { value: 1, min: 0, max: 1 },
//   temporalResolveCorrectionMix: { value: 1, min: 0, max: 1 },
//   maxSamples: { value: 0, min: 0, max: 1 },
//   resolutionScale: { value: 1, min: 0, max: 1 },
//   blurMix: { value: 0.2, min: 0, max: 1 },
//   blurKernelSize: { value: 8, min: 0, max: 8 },
//   BLUR_EXPONENT: { value: 10, min: 0, max: 20 },
//   rayStep: { value: 0.5, min: 0, max: 1 },
//   intensity: { value: 3.5, min: 0, max: 5 },
//   maxRoughness: { value: 1, min: 0, max: 1 },
//   jitter: { value: 1.4, min: 0, max: 5 },
//   jitterSpread: { value: 0.05, min: 0, max: 1 },
//   jitterRough: { value: 1, min: 0, max: 1 },
//   roughnessFadeOut: { value: 1, min: 0, max: 1 },
//   rayFadeOut: { value: 0, min: 0, max: 1 },
//   MAX_STEPS: { value: 20, min: 0, max: 20 },
//   NUM_BINARY_SEARCH_STEPS: { value: 6, min: 0, max: 10 },
//   maxDepthDifference: { value: 7, min: 0, max: 10 },
//   maxDepth: { value: 1, min: 0, max: 1 },
//   thickness: { value: 7.6, min: 0, max: 10 },
//   ior: { value: 1.33, min: 0, max: 2 },
// }

function useSettings(v) {
  v = JSON.parse(JSON.stringify(v))

  for (let kn in v) {
    if (typeof v[kn] === 'object' && typeof v[kn].value !== 'undefined') {
      v[kn] = v[kn].value
    }
  }

  return v
}

export function Effects({}) {
  const enable = useRender((s) => s.enable)

  // public/hdr/snowy_field_1k.hdr
  // const texture = useLoader(LUTCubeLoader, '/lut/F-6800-STD.cube')
  const texture = useLoader(LUTCubeLoader, '/lut/F-6800-STD.cube')

  // const { enabled, ...props } = useControls(settings, {}, {})

  let props = {
    temporalResolve: true,
    STRETCH_MISSED_RAYS: true,
    USE_MRT: true,
    USE_NORMALMAP: true,
    USE_ROUGHNESSMAP: true,
    ENABLE_JITTERING: true,
    ENABLE_BLUR: true,
    DITHERING: false,
    temporalResolveMix: 0.5,
    temporalResolveCorrectionMix: 0.5,
    maxSamples: 0,
    resolutionScale: 1,
    blurMix: 0.5,
    blurKernelSize: 8,
    BLUR_EXPONENT: 10,
    rayStep: 0.5,
    intensity: 3.5,
    maxRoughness: 1,
    jitter: 1.4,
    jitterSpread: 0.05,
    jitterRough: 1,
    roughnessFadeOut: 1,
    rayFadeOut: 0,
    MAX_STEPS: 20,
    NUM_BINARY_SEARCH_STEPS: 6,
    maxDepthDifference: 7,
    maxDepth: 1,
    thickness: 7.6,
    ior: 1.33,
  }

  // useEffect(() => {
  //   let tt = setInterval(() => {
  //     let svg = document.querySelector('svg')
  //     if (svg?.classList.toString().includes('leva')) {
  //       clearInterval(tt)
  //       if (window.innerWidth <= 500) {
  //         svg.parentElement.click()
  //       }
  //     }
  //   })
  // }, [])

  useFrame(({ camera, clock }) => {
    //
    let t = clock.getElapsedTime()

    camera.position.y += 0.00000001 * Math.sin(t * 1000)
  })

  return (
    <>
      {enable && (
        <>
          <CameraFling></CameraFling>
          <EffectComposer disableNormalPass>
            <Noise premultiply={true} opacity={0.35} />

            <SSR {...props} />
            <Bloom
              luminanceThreshold={0.0}
              mipmapBlur
              luminanceSmoothing={0}
              intensity={1}
            />
            <LUT lut={texture} />
            {/* <DepthOfField
            focusDistance={2}
            focalLength={0.02}
            bokehScale={2}
            height={480}
          /> */}
          </EffectComposer>
        </>
      )}
    </>
  )
}

function CameraFling() {
  let camera = useThree((s) => s.camera)

  useFrame(() => {
    camera.position.y += (Math.random() - 0.5) * 0.0001
  })
}
