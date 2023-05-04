import { OnlineGamePortfolio } from '@/vfx-meta/game/OnlineGamePortfolio'
import { Preload } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { sRGBEncoding } from 'three'

export default function Game() {
  return (
    <div className='w-full h-full'>
      <Canvas
        gl={{
          antialias: false,
          logarithmicDepthBuffer: true,
        }}
        onCreated={(st) => {
          st.gl.outputEncoding = sRGBEncoding
          st.gl.physicallyCorrectLights = true
          //

          st.camera.near = 0.05
          st.camera.updateProjectionMatrix()
        }}
      >
        <Suspense fallback={null}>
          <Preload all></Preload>
          <OnlineGamePortfolio></OnlineGamePortfolio>
        </Suspense>
      </Canvas>
    </div>
  )
}

//
