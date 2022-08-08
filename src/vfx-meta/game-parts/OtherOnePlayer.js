// import { Box as TestObject } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { MathUtils } from 'three'
import { Object3D, Sphere } from 'three140'
// import { useMetaStore } from '../store/use-meta-store'
// import { ClosetAvatar } from './ClosetAvatar'
import { RPMAvatar } from '../game-parts/RPMAvatar'
import { TempAvatar } from '../game-parts/TempAvatar'
import { useMetaStore } from '../store/use-meta-store'
import { ClosetAvatar } from './ClosetAvatar'

export function OtherOnePlayer({ speed = 9, otherPlayer }) {
  let targetO3D = useMemo(() => {
    let o3d = new Object3D()
    return o3d
  }, [])

  targetO3D.position.fromArray(otherPlayer.playerPosition)

  let avatarPartUpper = otherPlayer.avatarPartUpper
  let avatarPartLower = otherPlayer.avatarPartLower
  let avatarPartShoes = otherPlayer.avatarPartShoes
  let avatarPartSkeleton = otherPlayer.avatarPartSkeleton

  let avatarActionName = otherPlayer.avatarActionName

  let avatarActionRepeat = 1

  if (avatarActionName === 'front') {
    avatarActionRepeat = Infinity
  }

  if (avatarActionName === 'back') {
    avatarActionRepeat = Infinity
  }

  if (avatarActionName === 'left') {
    avatarActionRepeat = Infinity
  }

  if (avatarActionName === 'right') {
    avatarActionRepeat = Infinity
  }

  if (avatarActionName === 'jump') {
    avatarActionRepeat = Infinity
  }

  //
  // let avatarPartUpper = useMetaStore((s) => s.myCTX.avatarPartUpper)
  // let avatarPartLower = useMetaStore((s) => s.myCTX.avatarPartLower)
  // let avatarPartShoes = useMetaStore((s) => s.myCTX.avatarPartShoes)
  // let avatarPartSkeleton = useMetaStore((s) => s.myCTX.avatarPartSkeleton)
  let setExporter = useMetaStore((s) => s.myCTX.setExporter)

  let avatarVendor = otherPlayer.avatarVendor
  let avatarURL = otherPlayer.avatarURL
  let avatarURLWrap = otherPlayer.avatarURLWrap

  let ref = useRef()

  let [dist] = useState(() => {
    let o3 = new Object3D()
    return o3
  })

  let [action, setNPCAction] = useState('stand')

  useEffect(() => {
    if (ref.current.position.length() === 0) {
      ref.current.position.x = 5
    }
  }, [])

  //
  useFrame((st, dt) => {
    if (ref.current && targetO3D) {
      //ref.current
      dist.copy(targetO3D)

      let unit = dist.position.sub(ref.current.position).normalize()

      let diff = targetO3D.position.distanceTo(ref.current.position)
      if (diff >= 25) {
        ref.current.lookAt(
          targetO3D.position.x,
          ref.current.position.y,
          targetO3D.position.z
        )
        ref.current.position.copy(targetO3D.position)
        ref.current.position.x += 1
        if (action !== 'front') {
          setNPCAction('front')
        }
        //
      } else if (diff >= 3 && diff < 25) {
        ref.current.position.addScaledVector(unit, dt * speed)
        ref.current.lookAt(
          targetO3D.position.x,
          ref.current.position.y,
          targetO3D.position.z
        )
        if (action !== 'front') {
          setNPCAction('front')
        }
      } else {
        if (action !== 'stand') {
          setNPCAction('stand')
        }

        ref.current.position.y = MathUtils.lerp(
          ref.current.position.y,
          targetO3D.position.y,
          0.1
        )
      }
    }
  })

  return (
    <group ref={ref}>
      <group position={[0, -1.52, 0]}>
        <Suspense
          fallback={
            <>
              <Sphere args={[3, 32, 32]}></Sphere>
            </>
          }
        >
          {avatarVendor === 'temp' && (
            <TempAvatar
              setAction={setNPCAction}
              avatarActionName={avatarActionName}
              avatarActionRepeat={avatarActionRepeat}
              frustumCulled={false}
              avatarURL={avatarURLWrap}
            ></TempAvatar>
          )}

          {avatarVendor === 'rpm' && (
            <RPMAvatar
              avatarActionName={avatarActionName}
              avatarActionRepeat={avatarActionRepeat}
              avatarURL={avatarURL}
              setAction={setNPCAction}
              frustumCulled={false}
            ></RPMAvatar>
          )}

          {avatarVendor === 'closet' && (
            <ClosetAvatar
              avatarPartUpper={avatarPartUpper}
              avatarPartLower={avatarPartLower}
              avatarPartShoes={avatarPartShoes}
              avatarPartSkeleton={avatarPartSkeleton}
              setExporter={setExporter}
              //
              setAction={setNPCAction}
              avatarActionName={action}
              avatarActionRepeat={Infinity}
              //
              exportAvatar={false}
              frustumCulled={false}
            ></ClosetAvatar>
          )}
        </Suspense>
      </group>

      {/*  */}
    </group>
  )
}

//
