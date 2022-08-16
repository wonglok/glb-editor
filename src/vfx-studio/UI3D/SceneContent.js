import { useEffect, useRef } from 'react'
import { useAccessor } from '@/vfx-studio/store/use-accessor'
import { useThree } from '@react-three/fiber'
import { HDRTex } from './HDRTex'
import {
  FlyControls,
  MapControls,
  OrbitControls,
  Select,
} from '@react-three/drei'
import { BoxBufferGeometry, BoxHelper, Object3D, Vector3 } from 'three'
import anime from 'animejs'
import { EffectNodeRuntime } from '../effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { Player } from '@/vfx-meta/game-parts/Player'
import { OnlineSystem } from '@/vfx-meta/online/OnlineSystem'
import { useMetaStore } from '@/vfx-meta/store/use-meta-store'
import { Mesh, MeshBasicMaterial, Scene } from 'three140'
import { EnvLight } from '@/vfx-meta/game-vfx/EnvLight'
import { useRender } from '@/vfx-meta/store/use-render'

export function SceneContent({}) {
  let glbObject = useAccessor((s) => s.glbObject)
  let glbObjectBeforeEdit = useAccessor((s) => s.glbObjectBeforeEdit)
  let openEffectNode = useAccessor((s) => s.openEffectNode)
  let updateSelected = useAccessor((s) => s.updateSelected)
  let scene = useThree((s) => s.scene)
  let setContorl = useAccessor((s) => s.setContorl)
  // let openEffectNode = useAccessor((s) => s.openEffectNode)
  let setLayout = useAccessor((s) => s.setLayout)
  let control = useAccessor((s) => s.control)

  let setPlayerReady = useMetaStore((s) => s.setPlayerReady)
  let setPosition = useMetaStore((s) => s.setPosition)

  let setEnableDefaultHDR = useRender((s) => s.setEnableDefaultHDR)
  let enableDefaultHDR = useRender((s) => s.enableDefaultHDR)
  let clean = useRef(() => {
    return () => {}
  })

  //
  let setColliderFromScene = useMetaStore((s) => s.setColliderFromScene)
  useEffect(() => {
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
                //
                if (v[0]) {
                  openEffectNode(v[0])

                  // v[0].geometry.computeBoundingSphere()
                  // let center = v[0].geometry.boundingSphere.center
                  // let radius = v[0].geometry.boundingSphere.radius

                  // //
                  // let next = new Vector3()
                  // next.copy(center)
                  // v[0].updateMatrixWorld()
                  // next.applyMatrix4(v[0].matrixWorld)

                  // let diff = control.object.position
                  //   .clone()
                  //   .sub(control.target)
                  //   .normalize()
                  //   .multiplyScalar(radius * 2 + 1)

                  // let posFinal = next.clone().add(diff)

                  // let anim = anime({
                  //   targets: [control.object.position],
                  //   x: posFinal.x,
                  //   y: posFinal.y,
                  //   z: posFinal.z,
                  //   duration: 500,
                  //   easing: 'easeInOutQuad',
                  // })

                  // let anim2 = anime({
                  //   targets: [control.target],
                  //   x: next.x,
                  //   y: next.y,
                  //   z: next.z,
                  //   duration: 500,
                  //   easing: 'easeInOutQuad',
                  // })

                  // let h = () => {
                  //   window.removeEventListener('wheel', h)
                  //   anim.pause()
                  //   anim2.pause()
                  // }
                  // window.addEventListener('wheel', h)

                  let helper = new BoxHelper(v[0])

                  clean.current()
                  clean.current = () => {
                    helper.removeFromParent()
                  }

                  scene.add(helper)
                }
              }

              setTimeout(() => {
                onSelect(v)
              }, 100)
              setTimeout(() => {
                onSelect(v)
              }, 200)
              setTimeout(() => {
                onSelect(v)
              }, 300)
              setTimeout(() => {
                onSelect(v)
              }, 400)
            }}
            filter={(items) => items}
          >
            {/*  */}
            <primitive object={glbObject.scene}></primitive>
          </Select>

          <EffectNodeRuntime
            glbObject={glbObject}
            originalGLBObject={glbObjectBeforeEdit}
            disabledNodes={[]}
          ></EffectNodeRuntime>
        </>
      )}

      {/*  */}

      <Player></Player>

      <gridHelper args={[100, 50, 0x00ffff, 0xff00ff]}> </gridHelper>

      {enableDefaultHDR && (
        <HDRTex scene={scene} url={`/hdr/greenwich_park_02_1k.hdr`} />
      )}

      {/* <OrbitControls
        ref={(ev) => {
          setContorl(ev)
        }}
        object-position-y={1.73}
        target-y={0}
        object-position-z={3}
        makeDefault={true}
      ></OrbitControls> */}

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
