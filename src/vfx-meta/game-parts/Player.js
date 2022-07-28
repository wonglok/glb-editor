import { EffectNodeRuntime } from '@/vfx-studio/effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { Box, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { HDR } from '../game-parts/HDR'
import { useMetaStore } from '../store/use-meta-store'

export function Player() {
  let myCTX = useMetaStore((s) => s.myCTX)
  let updatePlayer = useMetaStore((s) => s.updatePlayer)
  let setControls = useMetaStore((s) => s.setControls)
  let setKeyboard = useMetaStore((s) => s.setKeyboard)

  let camera = useThree((s) => s.camera)
  let dom = useThree((s) => s.gl.domElement)
  useFrame((st, dt) => {
    updatePlayer(dt)
  })
  useEffect(() => {
    setKeyboard()
    setControls({ camera: camera, dom: dom })
  }, [])
  return (
    <group>
      <primitive object={myCTX.player}></primitive>
    </group>
  )
}
