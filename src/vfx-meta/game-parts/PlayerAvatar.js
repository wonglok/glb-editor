import { Sphere } from '@react-three/drei'
import { Suspense } from 'react'
import { useMetaStore } from '../store/use-meta-store'
import { ClosetAvatar } from './ClosetAvatar'
import { RPMAvatar } from './RPMAvatar'

export function PlayerAvatar() {
  let avatarVendor = useMetaStore((s) => s.myCTX.avatarVendor)

  let avatarURL = useMetaStore((s) => s.myCTX.avatarURL)
  let avatarActionName = useMetaStore((s) => s.myCTX.avatarActionName)
  let avatarActionIdleName = useMetaStore((s) => s.myCTX.avatarActionIdleName)
  let avatarActionRepeat = useMetaStore((s) => s.myCTX.avatarActionRepeat)

  let avatarPartUpper = useMetaStore((s) => s.myCTX.avatarPartUpper)
  let avatarPartLower = useMetaStore((s) => s.myCTX.avatarPartLower)
  let avatarPartShoes = useMetaStore((s) => s.myCTX.avatarPartShoes)

  return (
    <Suspense
      fallback={
        <>
          <Sphere args={[3, 32, 32]}></Sphere>
        </>
      }
    >
      {avatarVendor === 'rpm' && (
        <RPMAvatar
          avatarActionName={avatarActionName}
          avatarActionIdleName={avatarActionIdleName}
          avatarActionRepeat={avatarActionRepeat}
          avatarURL={avatarURL}
        ></RPMAvatar>
      )}

      {avatarVendor === 'closet' && (
        <ClosetAvatar
          key={avatarPartUpper + avatarPartLower + avatarPartShoes}
          avatarPartUpper={avatarPartUpper}
          avatarPartLower={avatarPartLower}
          avatarPartShoes={avatarPartShoes}
          //
          avatarActionName={avatarActionName}
          avatarActionIdleName={avatarActionIdleName}
          avatarActionRepeat={avatarActionRepeat}
        ></ClosetAvatar>
      )}
    </Suspense>
  )
}
