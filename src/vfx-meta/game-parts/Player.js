import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useMetaStore } from '../store/use-meta-store'
import { CompanionWrap } from './CompanionWrap'
import { NPCAvatar } from './NPCAvatar'
import { PlayerAvatar } from './PlayerAvatar'

export function Player() {
  let myCTX = useMetaStore((s) => s.myCTX)
  let updatePlayer = useMetaStore((s) => s.updatePlayer)
  let setControls = useMetaStore((s) => s.setControls)
  let setKeyboard = useMetaStore((s) => s.setKeyboard)

  let camera = useThree((s) => s.camera)
  let dom = useThree((s) => s.gl.domElement)
  useFrame((st, dt) => {
    updatePlayer((dt / 3) * 3)
  })
  useEffect(() => {
    return setKeyboard()
  }, [])

  useEffect(() => {
    return setControls({ camera: camera, dom: dom })
  }, [])

  let ref = useRef(false)

  useFrame(() => {
    if (ref.current && myCTX?.player) {
      ref.current.copy(myCTX.player)
      //
    }
  })

  //
  return (
    <group>
      {/*  */}
      {/*  */}
      <group ref={ref}>
        <group rotation-y={Math.PI} position={[0, -1.52, 0]}>
          <PlayerAvatar></PlayerAvatar>
        </group>
      </group>

      {myCTX?.player && (
        <CompanionWrap targetO3D={myCTX.player}>
          <NPCAvatar></NPCAvatar>
        </CompanionWrap>
      )}

      {/*  */}
      {/*  */}
      {/* <primitive object={myCTX.player}></primitive> */}

      {/*  */}
      {/*  */}
    </group>
  )
}
