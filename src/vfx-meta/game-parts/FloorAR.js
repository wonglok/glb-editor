import { EffectNodeRuntime } from '@/vfx-studio/effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { BoxBufferGeometry } from 'three'
import { Mesh, MeshBasicMaterial, Scene } from 'three140'
import { useMetaStore } from '../store/use-meta-store'

export function FloorAR({}) {
  // let glb = useGLTF(url)
  let playerInfoIsReady = useMetaStore((s) => s.playerInfoIsReady)
  // let setColliderFromScene = useMetaStore((s) => s.setColliderFromScene)

  // let anim = useAnimations(glb.animations, glb.scene)

  // useEffect(() => {
  //   if (glb) {
  //     Object.values(anim.actions).forEach((e) => e.play())
  //     setColliderFromScene({ scene: glb.scene })
  //   }
  // }, [glb])

  let setPlayerReady = useMetaStore((s) => s.setPlayerReady)
  let setPosition = useMetaStore((s) => s.setPosition)

  let setColliderFromScene = useMetaStore((s) => s.setColliderFromScene)
  useEffect(() => {
    //
    let planeScene = new Scene()
    planeScene.add(
      new Mesh(new BoxBufferGeometry(850, 0.1, 850), new MeshBasicMaterial())
    )
    setColliderFromScene({ scene: planeScene })

    // setPosition({ initPos: [0, 1.5, 2], cameraOffset: [0, 0, 5] })
    // setTimeout(() => {
    //   setPlayerReady(true)
    // }, 100)

    // playerInfoIsReady
  }, [setColliderFromScene, setPlayerReady, setPosition])

  return (
    <group>
      {/*  */}
      {playerInfoIsReady && (
        <>
          <gridHelper args={[100, 50, 0xff0000, 0xff0000]}></gridHelper>
          {/* <primitive object={glb.scene}></primitive>
          <EffectNodeRuntime
            key={url}
            disabledNodes={[]}
            glbObject={glb}
          ></EffectNodeRuntime> */}
        </>
      )}
    </group>
  )
}

//
