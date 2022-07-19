import Shader from '@/components/canvas/Shader/Shader'
import { ENLogicGraphAutoLoad } from '@/vfx-runtime/ENLogicGraph'
import { useXR, VRCanvas } from '@react-three/xr'
import { HomePageGraphID } from 'firebase.config'
import { useEffect } from 'react'
// import { Box } from '@react-three/drei'

export default function Page() {
  return (
    <>
      <VRCanvas>
        <Content></Content>
      </VRCanvas>
    </>
  )
}

function Content() {
  return (
    <group position={[0, 0, 0]}>
      {/* <mesh>
        <boxGeometry />
        <meshBasicMaterial color='blue' />
      </mesh> */}
      {/* <Shader></Shader> */}

      {/* XR */}
      <ENLogicGraphAutoLoad
        graphID={`-N7Izr9ntFQQWtZfGurM`}
      ></ENLogicGraphAutoLoad>
    </group>
  )
}
