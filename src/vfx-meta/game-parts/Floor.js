import { EffectNodeRuntime } from '@/vfx-studio/effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { useMetaStore } from '../store/use-meta-store'

export function Floor({ url = '/scene/dome/dome.glb' }) {
  let glb = useGLTF(url)
  let setColliderFromScene = useMetaStore((s) => s.setColliderFromScene)

  useEffect(() => {
    if (glb) {
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
