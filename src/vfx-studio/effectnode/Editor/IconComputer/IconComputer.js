import { Sphere, useGLTF } from '@react-three/drei'
import { Suspense } from 'react'

export function IconComputer({ onClick = () => {} }) {
  return (
    <Suspense fallback={<Sphere onPointerDown={onClick}></Sphere>}>
      <IconComputerInside onClick={onClick}></IconComputerInside>
    </Suspense>
  )
}

export function IconComputerInside({ onClick }) {
  let glb = useGLTF(`/items-glb/mac-draco.glb`)
  return (
    <group scale={0.5} onPointerDown={onClick}>
      <primitive object={glb.scene}></primitive>
    </group>
  )
}
