import { useFrame, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
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
    return setKeyboard()
  }, [])

  useEffect(() => {
    return setControls({ camera: camera, dom: dom })
  }, [])

  //
  return (
    <group>
      <primitive object={myCTX.player}></primitive>
    </group>
  )
}
