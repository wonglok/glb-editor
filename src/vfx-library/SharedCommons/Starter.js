import { Canvas } from '@react-three/fiber'
import { CineonToneMapping, sRGBEncoding } from 'three'

export function Starter({ children, reducedDPI = 2 }) {
  return (
    <Canvas
      concurrent
      dpr={[1, reducedDPI]}
      gl={{ antialias: true }}
      onCreated={(state) => {}}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </Canvas>
  )
}
