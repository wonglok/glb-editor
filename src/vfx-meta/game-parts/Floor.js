import { EffectNodeRuntime } from '@/vfx-studio/effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { Box, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
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
