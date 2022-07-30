import { Gameinside } from '@/vfx-meta/game/GameInside'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { sRGBEncoding } from 'three'

export default function Game() {
  return (
    <div className='w-full h-full'>
      <Canvas
        onCreated={(st) => {
          st.gl.outputEncoding = sRGBEncoding
          st.gl.physicallyCorrectLights = true
          //

          st.camera.near = 0.05
          st.camera.updateProjectionMatrix()
        }}
      >
        <Suspense fallback={null}>
          <Gameinside></Gameinside>
        </Suspense>
      </Canvas>
    </div>
  )
}
