import { useEffect, useMemo, useRef } from 'react'
import { useAccessor } from '@/vfx-studio/store/use-accessor'
import { useThree } from '@react-three/fiber'
import { HDRTex } from './HDRTex'
import {
  Box,
  Capsule,
  // FlyControls,
  // MapControls,
  // OrbitControls,
  Select,
  useAnimations,
} from '@react-three/drei'
import { BoxBufferGeometry, BoxHelper, Object3D } from 'three'
// import anime from 'animejs'
import { EffectNodeRuntime } from '../effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { Player } from '@/vfx-meta/game-parts/Player'
// import { OnlineSystem } from '@/vfx-meta/online/OnlineSystem'
import { useMetaStore } from '@/vfx-meta/store/use-meta-store'
import { Mesh, MeshBasicMaterial, Scene } from 'three140'
// import { EnvLight } from '@/vfx-meta/game-vfx/EnvLight'
import { useRender } from '@/vfx-meta/store/use-render'
import { useENEditor } from '../store/use-en-editor'
// import { SceneTransformControl } from './SceneTransformControl'
import { AdaptTC } from './AdaptTC'

//

export function SceneContent({}) {
  let glbObject = useAccessor((s) => s.glbObject)
  let glbObjectBeforeEdit = useAccessor((s) => s.glbObjectBeforeEdit)
  let openEffectNode = useAccessor((s) => s.openEffectNode)
  // let updateSelected = useAccessor((s) => s.updateSelected)
  let scene = useThree((s) => s.scene)
  let setOverlay = useENEditor((s) => s.setOverlay)

  // let setContorl = useAccessor((s) => s.setContorl)
  // let openEffectNode = useAccessor((s) => s.openEffectNode)
  // let setLayout = useAccessor((s) => s.setLayout)
  // let control = useAccessor((s) => s.control)

  let setPlayerReady = useMetaStore((s) => s.setPlayerReady)
  let setPosition = useMetaStore((s) => s.setPosition)

  // let setEnableDefaultHDR = useRender((s) => s.setEnableDefaultHDR)
  let enableDefaultHDR = useRender((s) => s.enableDefaultHDR)
  let clean = useRef(() => {
    return () => {}
  })

  let anim = useAnimations(
    glbObject?.animations || [],
    glbObject?.scene || new Object3D()
  )

  //
  useEffect(() => {
    let canStand = anim.actions.stand

    if (canStand) {
      anim.mixer.stopAllAction()
      canStand.play()
    } else {
      anim.mixer.stopAllAction()
      Object.values(anim.actions).forEach((e) => e.play())
    }
  })

  let setColliderFromScene = useMetaStore((s) => s.setColliderFromScene)
  useEffect(() => {
    //
    let planeScene = new Scene()
    planeScene.add(
      new Mesh(new BoxBufferGeometry(850, 0.1, 850), new MeshBasicMaterial())
    )
    setColliderFromScene({ scene: planeScene })

    setPosition({ initPos: [0, 1.5, 2], cameraOffset: [0, 0, 5] })
    setTimeout(() => {
      setPlayerReady(true)
    }, 100)

    // playerInfoIsReady
  }, [setColliderFromScene, setPlayerReady, setPosition])

  //

  return (
    <>
      {/*  */}
      {glbObject && glbObjectBeforeEdit && (
        <>
          <Select
            box
            // multiple={false}
            onChange={(v) => {
              let onSelect = (v) => {
                if (v[0]) {
                  let ctrl = useMetaStore.getState().controls

                  if (ctrl.enabled) {
                    openEffectNode(v[0])
                    setOverlay(null)
                  }
                }
              }

              setTimeout(() => {
                onSelect(v)
              }, 100)

              //
            }}
            //
            filter={(items) => items}
          >
            {/*  */}
            <primitive object={glbObject.scene}></primitive>
          </Select>

          <EffectNodeRuntime
            glbObject={glbObject}
            originalGLBObject={glbObjectBeforeEdit}
            disabledNodes={[]}
            isEditingMode={true}
          ></EffectNodeRuntime>
        </>
      )}
      {/*  */}
      {/*  */}
      {/*  */}
      <Player show={false}>
        <Box position={[0, 0, 0]} args={[0.0, 0.0, 0.0]}></Box>
      </Player>
      <gridHelper args={[100, 50, 0x00ffff, 0xff00ff]}> </gridHelper>
      {enableDefaultHDR && (
        <HDRTex scene={scene} url={`/hdr/greenwich_park_02_1k.hdr`} />
      )}
      {glbObject && <AdaptTC node={glbObject.scene}></AdaptTC>}
      <Helper></Helper>
      {/* <TransformControls></TransformControls> */}
      {/*

      <OrbitControls
        ref={(ev) => {
          setContorl(ev)
        }}
        object-position-y={1.73}
        target-y={0}
        object-position-z={3}
        makeDefault={true}
      ></OrbitControls>

      */}
      {/* <MapControls
        object-position-y={3}
        object-position-z={3}
        target-x={0}
        target-y={0}
        target-z={0}
        enableZoom={true}
        ref={(ev) => {
          setContorl(ev)
        }}
        enableRotate={false}
      /> */}
    </>
  )
}

//

function Helper() {
  let selectedMeshes = useAccessor((s) => s.selectedMeshes)
  return (
    <>
      {selectedMeshes && selectedMeshes[0] && (
        <boxHelper args={[selectedMeshes[0]]}></boxHelper>
      )}
    </>
  )
}
