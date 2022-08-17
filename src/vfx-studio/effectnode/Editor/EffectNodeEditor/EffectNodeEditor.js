import { Box, MapControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { AdditiveBlending } from 'three'
import { useAccessor } from '@/vfx-studio/store/use-accessor'
import { useENEditor } from '@/vfx-studio/store/use-en-editor'
import { ConnectedWires } from '../ConnectedWires/ConnectedWires'
import { DraggingWire } from '../DraggingWire/DraggingWire'
import { HDR } from '../HDR/HDR'
import { IconComputer } from '../IconComputer/IconComputer'
import { NodeDetail } from '../NodeDetail/NodeDetail'
import { NodesAdd } from '../NodesAdd/NodesAdd'
import { AddItemCurosr } from './AddItemCurosr'
import { Nodes } from './Nodes'

export function EffectNodeEditor({ glb, mesh, graph }) {
  let overlay = useENEditor((s) => s.overlay)
  return (
    <div
      className={`w-full h-full ${overlay === 'nodeDetail' ? ' relative' : ''}`}
    >
      <Canvas>
        <ContentInside></ContentInside>
      </Canvas>
      <NodesAdd></NodesAdd>
      <NodeDetail></NodeDetail>
    </div>
  )
}

function ContentInside() {
  let [firstMesh] = useAccessor((s) => s.selectedMeshes)

  let reloadGraphID = useENEditor((s) => s.reloadGraphID)
  let setEffectNode = useENEditor((s) => s.setEffectNode)
  let curosrPoint = useENEditor((s) => s.curosrPoint)
  let setOverlay = useENEditor((s) => s.setOverlay)
  let cursorMode = useENEditor((s) => s.cursorMode)
  let addByPlacing = useENEditor((s) => s.addByPlacing)
  let setControl = useENEditor((s) => s.setControl)
  let control = useENEditor((s) => s.control)
  let setNodeDrag = useENEditor((s) => s.setNodeDrag)
  let effectNode = firstMesh?.userData?.effectNode
  //

  useEffect(() => {
    if (effectNode && firstMesh) {
      setEffectNode({ uuid: firstMesh.uuid, effectNode: effectNode })
    }
  }, [effectNode, firstMesh, firstMesh.uuid, setEffectNode])

  // let glbObject = useAccessor((s) => s.glbObject)
  // let scene = useThree((s) => s.scene)
  // let curosrPoint = useENEditor((s) => s.curosrPoint)
  // console.log(effectNode)
  // inputs

  return (
    <>
      <group>
        <Suspense fallback={null}>
          <group name={reloadGraphID}></group>
          <DraggingWire></DraggingWire>
          <HDR></HDR>

          <group position={[0, 0.5, 0]}>
            <IconComputer
              onClick={() => {
                //
                setOverlay('add')
              }}
            ></IconComputer>
          </group>
        </Suspense>

        <MapControls
          ref={(control) => {
            //
            setControl(control)
            //
          }}
          object-position={[0, 30, 30]}
          enableDamping={true}
          enableRotate={false}
          enablePan={true}
        ></MapControls>

        <group position={[0, 0.15, 0]}>
          <gridHelper args={[500, 100, 0xff0000, 0xbababba]}></gridHelper>
        </group>

        <Box
          onPointerDown={(ev) => {
            if (cursorMode === 'add') {
              addByPlacing()
            }

            curosrPoint.userData.added.set(0, 0, 0)
          }}
          onPointerMove={(ev) => {
            curosrPoint.userData.diff.copy(ev.point).sub(curosrPoint.position)

            curosrPoint.userData.added.add(curosrPoint.userData.diff)
            curosrPoint.position.copy(ev.point)
            curosrPoint.position.y = 1
          }}
          args={[500, 0.1, 500]}
          //

          onPointerUp={() => {
            setNodeDrag(null)
            control.enabled = true
            curosrPoint.userData.added.set(0, 0, 0)
          }}
        >
          <shaderMaterial
            fragmentShader={
              /* glsl */ `
              void main (void) {
                gl_FragColor = vec4(0.0);
                discard;
              }
            `
            }
            depthTest={false}
            depthWrite={false}
            transparent={true}
            blending={AdditiveBlending}
          ></shaderMaterial>

          {/*  */}
          {/*  */}
          {/*  */}
        </Box>

        <AddItemCurosr></AddItemCurosr>

        <Nodes></Nodes>

        <group position={[0, 1, 0]}>
          <ConnectedWires></ConnectedWires>
        </group>

        {/*  */}
        {/*  */}
        {/*  */}
      </group>
    </>
  )
}

//

//

//

//
