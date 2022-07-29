import { Sphere } from '@react-three/drei'
import { Suspense } from 'react'
import { useMetaStore } from '../store/use-meta-store'
import { RPMAvatar } from './RPMAvatar'

export function PlayerAvatar() {
  let avatarURL = useMetaStore((s) => s.myCTX.avatarURL)
  let avatarVendor = useMetaStore((s) => s.myCTX.avatarVendor)
  let avatarActionName = useMetaStore((s) => s.myCTX.avatarActionName)
  let avatarActionRepeat = useMetaStore((s) => s.myCTX.avatarActionRepeat)
  let avatarRPMActionURLSet = useMetaStore((s) => s.myCTX.avatarRPMActionURLSet)
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
          avatarRPMActionURLSet={avatarRPMActionURLSet}
          avatarActionRepeat={avatarActionRepeat}
          avatarActionName={avatarActionName}
          avatarVendor={avatarVendor}
          avatarURL={avatarURL}
        ></RPMAvatar>
      )}

      {/*  */}
      {/* <UniversalAvatar
        avatarActionURLSet={avatarActionURLSet}
        avatarActionRepeat={avatarActionRepeat}
        avatarActionName={avatarActionName}
        avatarVendor={avatarVendor}
        avatarURL={avatarURL}
      ></UniversalAvatar> */}
    </Suspense>
  )
}
