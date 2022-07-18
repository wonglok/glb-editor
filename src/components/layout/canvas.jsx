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
// import { Core } from '@/vfx-core/Core'

// const LControl = () => {
//   const dom = useStore((state) => state.dom)
//   const control = useRef(null)

//   useEffect(() => {
//     if (control.current) {
//       const domElement = dom.current
//       const originalTouchAction = domElement.style['touch-action']
//       domElement.style['touch-action'] = 'none'

//       return () => {
//         domElement.style['touch-action'] = originalTouchAction
//       }
//     }
//   }, [dom, control])
//   // @ts-ignore
//   return <OrbitControls ref={control} domElement={dom.current} />
// }

const LCanvas = ({ children }) => {
  const dom = useStore((state) => state.dom)

  return (
    <div className='w-full h-full' id='myroot'>
      <Canvas
        mode='concurrent'
        style={{
          position: 'absolute',
          top: 0,
          zIndex: 20,
        }}
        // gl={(rendererCanvas) => {
        //   const renderer = new WebGLRenderer({
        //     canvas: rendererCanvas,
        //     powerPreference: 'high-performance',
        //     premultipliedAlpha: false,
        //     depth: false,
        //     stencil: false,
        //     antialias: false,
        //     preserveDrawingBuffer: true,
        //   })

        //   // renderer.outputEncoding = sRGBEncoding
        //   // renderer.toneMapping = ACESFilmicToneMapping

        //   return renderer
        // }}
        // onCreated={(state) => state.events.connect(dom.current)}
      >
        {/* <LControl /> */}

        <Preload all />

        {/* <Effect></Effect> */}

        {children}
      </Canvas>
    </div>
  )
}

export default LCanvas
