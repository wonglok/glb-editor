import { EffectNodeRuntime } from '@/vfx-studio/effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { useMetaStore } from '../store/use-meta-store'

export function Floor({ url = '/scene/dome/dome.glb' }) {
  let glb = useGLTF(url)
  let setColliderFromScene = useMetaStore((s) => s.setColliderFromScene)

  let anim = useAnimations(glb.animations, glb.scene)

  useEffect(() => {
    if (glb) {
      Object.values(anim.actions).forEach((e) => e.play())
      setColliderFromScene({ scene: glb.scene })
    }
  }, [glb])

  return (
    <group>
      {/*  */}

      <primitive object={glb.scene}></primitive>
      <EffectNodeRuntime glbObject={glb}></EffectNodeRuntime>
    </group>
  )
}

//
