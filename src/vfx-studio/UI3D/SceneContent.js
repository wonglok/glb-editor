import { useRef } from 'react'
import { useAccessor } from '@/vfx-studio/store/use-accessor'
import { useThree } from '@react-three/fiber'
import { HDRTex } from './HDRTex'
import { OrbitControls, Select } from '@react-three/drei'
import { BoxHelper, Object3D, Vector3 } from 'three'
import anime from 'animejs'
import { EffectNodeRuntime } from '../effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'

export function SceneContent({}) {
  let glbObject = useAccessor((s) => s.glbObject)
  let updateSelected = useAccessor((s) => s.updateSelected)
  let scene = useThree((s) => s.scene)
  let setContorl = useAccessor((s) => s.setContorl)
  let setLayout = useAccessor((s) => s.setLayout)
  let control = useAccessor((s) => s.control)

  let clean = useRef(() => {
    return () => {}
  })

  //
  return (
    <>
      {/*  */}
      {glbObject && (
        <Select
          box
          // multiple={false}
          onChange={(v) => {
            updateSelected(v)

            setTimeout(() => {
              setLayout((s) => 'full')
            }, 100)

            //
            if (v[0]) {
              v[0].geometry.computeBoundingSphere()
              let center = v[0].geometry.boundingSphere.center
              let radius = v[0].geometry.boundingSphere.radius

              //
              let next = new Vector3()
              next.copy(center)
              v[0].updateMatrixWorld()
              next.applyMatrix4(v[0].matrixWorld)

              let diff = control.object.position
                .clone()
                .sub(control.target)
                .normalize()
                .multiplyScalar(radius * 2 + 1)

              let posFinal = next.clone().add(diff)

              let anim = anime({
                targets: [control.object.position],
                x: posFinal.x,
                y: posFinal.y,
                z: posFinal.z,
                duration: 500,
                easing: 'easeInOutQuad',
              })

              let anim2 = anime({
                targets: [control.target],
                x: next.x,
                y: next.y,
                z: next.z,
                duration: 500,
                easing: 'easeInOutQuad',
              })

              let h = () => {
                window.removeEventListener('wheel', h)
                anim.pause()
                anim2.pause()
              }
              window.addEventListener('wheel', h)

              clean.current()
              let helper = new BoxHelper(v[0])
              clean.current = () => {
                helper.removeFromParent()
              }

              scene.add(helper)
            }
          }}
          filter={(items) => items}
        >
          <primitive object={glbObject.scene}></primitive>
          <EffectNodeRuntime glbObject={glbObject}></EffectNodeRuntime>
        </Select>
      )}

      <HDRTex scene={scene} url={`/hdr/greenwich_park_02_1k.hdr`} />

      <OrbitControls
        ref={(ev) => {
          setContorl(ev)
        }}
        object-position-y={1.73}
        target-y={0}
        object-position-z={3}
        makeDefault={true}
      ></OrbitControls>
    </>
  )
}

//
