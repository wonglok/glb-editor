import { Box } from '@react-three/drei'
import { createPortal, useThree } from '@react-three/fiber'
import { DoubleSide } from 'three'
import { useMetaStore } from '../store/use-meta-store'

export function ARBG() {
  let camera = useThree((s) => s.camera)
  let arTexture = useMetaStore((s) => s.arTexture)
  return (
    <>
      {arTexture &&
        createPortal(
          <group lookAt={camera.position} position={[0, 0, -60]}>
            <Box
              args={[
                1,
                arTexture.image.videoHeight / arTexture.image.videoWidth,
                0.0001,
              ]}
              scale={60.1 * 2}
            >
              <meshBasicMaterial
                side={DoubleSide}
                color={'#ffffff'}
                map={arTexture}
              ></meshBasicMaterial>
            </Box>
          </group>,
          camera
        )}
      <primitive object={camera}></primitive>
    </>
  )
}
