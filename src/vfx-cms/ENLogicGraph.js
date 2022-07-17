import { Canvas } from '@react-three/fiber'
import { useRouter } from 'next/router'

//
import { ENState } from './ENState'
import { ENControls } from './ENControls'

//
// import { Text } from "@react-three/drei";
import { ENCore } from './ENCore'
import { ENHDRI } from './ENHDRI'
import { useEffect } from 'react'
import { ENHtml } from './ENHtmls'
import { ENDisplayConnectorWire, ENDisplayCursor } from './ENDisplayCursor'
// import { ENNode } from './ENNode'
import { ENDisplayLinks, ENDisplayNodes } from './ENDisplayNodes'
import { HDR } from './HDR'
import { MiniBrowser } from './MiniBrowser'

export function ENLogicGraph() {
  let router = useRouter()

  useEffect(() => {
    ENState.canvasID = router.query.canvasID
    ENState.canvasOwnerID = router.query.ownerID
  }, [router.query.canvasID, router.query.ownerID])
  return (
    <div className='flex w-full h-full'>
      <div className='relative h-full' style={{ width: `calc(100% - 45%)` }}>
        <Canvas
          dpr={
            (typeof window !== 'undefined' && window.devicePixelRatio) || 1.0
          }
        >
          <LogicContent></LogicContent>
        </Canvas>
        <ENHtml></ENHtml>
      </div>

      {/*  */}
      <div className='h-full' style={{ width: `45%` }}>
        {router.query.canvasID && (
          <MiniBrowser graphID={router.query.canvasID}></MiniBrowser>
        )}
      </div>
      {/*  */}
    </div>
  )

  //

  //

  // return <div>Canvas ID: {router.query.canvasID}</div>;
}

// ENState
function LogicContent() {
  return (
    <group>
      {/*  */}
      <ENControls></ENControls>

      {/* <directionalLight
        position={[10, 10, -10]}
        args={["#ffffff", 0.5]}
      ></directionalLight>

      <directionalLight
        position={[-10, 10, 10]}
        args={["#ffffff", 0.5]}
      ></directionalLight> */}

      {/* <ENHDRI></ENHDRI> */}

      <ENCore></ENCore>

      <ENDisplayNodes></ENDisplayNodes>
      <ENDisplayLinks></ENDisplayLinks>

      <ENDisplayCursor></ENDisplayCursor>

      <ENDisplayConnectorWire></ENDisplayConnectorWire>

      {/* <Text color="#000000">Loading...</Text> */}

      <HDR></HDR>
    </group>
  )
}

//
