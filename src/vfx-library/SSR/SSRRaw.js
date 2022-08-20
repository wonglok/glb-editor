import { useThree } from '@react-three/fiber'
import { forwardRef, useEffect, useMemo } from 'react'
import { SSREffect, defaultSSROptions } from 'screen-space-reflections'
import { SSRDebugGUI } from './SSRDebugGUI'

export let SSRRawComponentDefaultProps = {
  // intensity: 1,
  // exponent: 1,
  // distance: 10,
  // fade: 0,
  // roughnessFade: 1,
  // thickness: 10,
  // ior: 1.45,
  // maxRoughness: 1,
  // maxDepthDifference: 10,
  // blend: 0.9,
  // correction: 1,
  // correctionRadius: 1,
  // blur: 0.5,
  // blurKernel: 1,
  // blurSharpness: 10,
  // jitter: 0,
  // jitterRoughness: 0,
  // steps: 20,
  // refineSteps: 5,
  // missedRays: true,
  // useNormalMap: true,
  // useRoughnessMap: true,
  // resolutionScale: 1,
  // velocityResolutionScale: 1,
  ...defaultSSROptions,
}

export const SSRRawComponent = forwardRef(function SSRRawComponent(
  { ...props },
  ref
) {
  let scene = useThree((s) => s.scene)
  let camera = useThree((s) => s.camera)
  // const { ssr, gui } = useMemo(() => {
  //   let ssr = new SSREffect(scene, camera, props)

  //   const gui = new SSRDebugGUI(ssr, props)

  //   return { ssr, gui }
  // }, [scene, camera, props])

  return <primitive ref={ref} object={ssr} dispose={null} />
})

//SSGI
