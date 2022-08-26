// import { UIContent } from '@/vfx-core/UIContent'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useMetaStore } from '../store/use-meta-store'
// import { CompanionWrap } from './CompanionWrap'
// import { CompanionWrap } from './CompanionWrap'
import { JoyStick } from './JoyStick'
// import { NPCAvatar } from './NPCAvatar'
import { PlayerAvatar } from './PlayerAvatar'

export function Player({ isAR = false, children, show = true }) {
  let myCTX = useMetaStore((s) => s.myCTX)
  let updatePlayer = useMetaStore((s) => s.updatePlayer)
  let setControls = useMetaStore((s) => s.setControls)
  let setControlsAR = useMetaStore((s) => s.setControlsAR)
  let setKeyboard = useMetaStore((s) => s.setKeyboard)
  let playerInfoIsReady = useMetaStore((s) => s.playerInfoIsReady)
  // let goFowradDown = useMetaStore((s) => s.goFowradDown)
  // let goFowradUp = useMetaStore((s) => s.goFowradUp)

  let camera = useThree((s) => s.camera)
  let dom = useThree((s) => s.gl.domElement)
  useFrame((st, dt) => {
    if (playerInfoIsReady) {
      updatePlayer((dt / 3) * 3)
    }
  })
  useEffect(() => {
    return setKeyboard()
  }, [])

  useEffect(() => {
    return setControls({ camera: camera, dom: dom, isAR })
  }, [])

  let ref = useRef(false)

  useFrame(() => {
    if (ref.current && myCTX?.player) {
      ref.current.copy(myCTX.player)
    }
  })

  //
  return (
    <group>
      {/*  */}
      {/*  */}
      {/*  */}
      <group ref={ref}>
        {playerInfoIsReady && <>{children}</>}
        {playerInfoIsReady && show && (
          <group>
            <group rotation-y={Math.PI} position={[0, -1.52, 0]}>
              <PlayerAvatar></PlayerAvatar>
            </group>
          </group>
        )}
      </group>

      {/*  */}
      {/*  */}
      {playerInfoIsReady && show === true && <JoyStick></JoyStick>}

      {/*  */}
      {/*  */}
      {/* <CompanionWrap
        onChangeStatus={(v) => {
          //
          // onChangeStatus
          //
          // if (status !== v) {
          //   setStatus(v)
          // }
        }}
        speed={6.5}
        targetO3D={myCTX.player}
      ></CompanionWrap> */}
      {/*  */}
      {/*  */}
      {/* <primitive object={myCTX.player}></primitive> */}
      {/*  */}
      {/*  */}
    </group>
  )
}
//

//

//
