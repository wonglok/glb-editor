import { Sphere } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { useMetaStore } from '../store/use-meta-store'
import { ClosetAvatar } from './ClosetAvatar'
import { RPMAvatar } from './RPMAvatar'

export function NPCAvatar({ status }) {
  let player = useMetaStore((s) => s.myCTX.player)
  let avatarVendor = useMetaStore((s) => s.myCTX.avatarVendor)

  let avatarURL = useMetaStore((s) => s.myCTX.avatarURL)
  let avatarActionName = useMetaStore((s) => s.myCTX.avatarActionName)
  let avatarActionIdleName = useMetaStore((s) => s.myCTX.avatarActionIdleName)
  let avatarActionRepeat = useMetaStore((s) => s.myCTX.avatarActionRepeat)

  let avatarPartUpper = useMetaStore((s) => s.myCTX.avatarPartUpper)
  let avatarPartLower = useMetaStore((s) => s.myCTX.avatarPartLower)
  let avatarPartShoes = useMetaStore((s) => s.myCTX.avatarPartShoes)
  let avatarPartSkeleton = useMetaStore((s) => s.myCTX.avatarPartSkeleton)
  let setExporter = useMetaStore((s) => s.myCTX.setExporter)
  let setAction = useMetaStore((s) => s.setAction)

  let ref = useRef()

  useFrame(({ camera }) => {
    if (ref.current) {
      if (camera.position.distanceTo(player.position) < 0.2) {
        ref.current.visible = false
      } else {
        ref.current.visible = true
      }
    }
  })

  // if (avatarActionName === 'left') {
  //   avatarActionName = 'front'
  // }
  // if (avatarActionName === 'right') {
  //   avatarActionName = 'front'
  // }

  if (status === 'running') {
    avatarActionName = 'front'
  } else {
    avatarActionName = avatarActionIdleName
  }

  return (
    <group ref={ref}>
      <Suspense
        fallback={
          <>
            <Sphere args={[3, 32, 32]}></Sphere>
          </>
        }
      >
        {avatarVendor === 'rpm' && (
          <RPMAvatar
            setAction={setAction}
            avatarActionName={avatarActionName}
            avatarActionIdleName={avatarActionIdleName}
            avatarActionRepeat={avatarActionRepeat}
            avatarURL={avatarURL}
            frustumCulled={true}
          ></RPMAvatar>
        )}

        {avatarVendor === 'closet' && (
          <ClosetAvatar
            setAction={setAction}
            avatarPartUpper={avatarPartUpper}
            avatarPartLower={avatarPartLower}
            avatarPartShoes={avatarPartShoes}
            avatarPartSkeleton={avatarPartSkeleton}
            setExporter={setExporter}
            //
            avatarActionName={avatarActionName}
            avatarActionIdleName={avatarActionIdleName}
            avatarActionRepeat={avatarActionRepeat}
            //
            exportAvatar={true}
            frustumCulled={true}
          ></ClosetAvatar>
        )}
      </Suspense>
    </group>
  )
}
