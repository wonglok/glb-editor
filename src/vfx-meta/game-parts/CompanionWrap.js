import { Box as TestObject } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Object3D } from 'three140'

export function CompanionWrap({ targetO3D, children }) {
  let ref = useRef()

  let [dist] = useState(() => {
    let o3 = new Object3D()
    return o3
  })
  useEffect(() => {
    if (ref.current.position.length() === 0) {
      ref.current.position.x = 5
    }
  }, [])
  useFrame((st, dt) => {
    if (ref.current && targetO3D) {
      //ref.current
      dist.copy(targetO3D)

      let unit = dist.position.sub(ref.current.position).normalize()

      let diff = targetO3D.position.distanceTo(ref.current.position)
      if (diff > 25) {
        ref.current.position.lerp(targetO3D.position, 0.5)
        ref.current.lookAt(
          targetO3D.position.x,
          ref.current.position.y,
          targetO3D.position.z
        )
      } else if (diff >= 2 && diff <= 25) {
        ref.current.position.addScaledVector(unit, dt * 9.0)
        ref.current.lookAt(
          targetO3D.position.x,
          ref.current.position.y,
          targetO3D.position.z
        )
      } else {
        ref.current.position.y = targetO3D.position.y
      }
    }
  })

  return (
    <group ref={ref}>
      {children ? (
        <group position={[0, -1.52, 0]}>{children}</group>
      ) : (
        <group
          rotation-x={Math.PI * 0.25}
          position={[0, 0.5, 0]}
          scale={[0.5, 2, 0.1]}
        >
          {<TestObject></TestObject>}
        </group>
      )}

      {/*  */}

      {/*  */}
    </group>
  )
}

//
