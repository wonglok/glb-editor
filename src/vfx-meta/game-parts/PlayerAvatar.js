import { Sphere, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { useMetaStore } from '../store/use-meta-store'
import { ClosetAvatar } from './ClosetAvatar'
import { RPMAvatar } from './RPMAvatar'
import { TempAvatar } from './TempAvatar'

export function PlayerAvatar() {
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
  let avatarURLWrap = useMetaStore((s) => s.myCTX.avatarURLWrap)

  //
  let setExporter = useMetaStore((s) => s.setExporter)
  let setAction = useMetaStore((s) => s.setAction)

  //
  let setStartLoading = useMetaStore((s) => s.setStartLoading)
  let setDoneLoading = useMetaStore((s) => s.setDoneLoading)

  //  useMetaStore.getState().setStartLoading
  let onBeginLoading = () => {
    setStartLoading()
  }
  let onDoneLoading = () => {
    setDoneLoading()
  }

  //
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

  let myself = useMetaStore((s) => s.myCTX)
  let videoTextures = useMetaStore((s) => s.videoTextures)
  let map = videoTextures[myself?.uid] || null
  let aspect = map?.aspect || 1

  return (
    <group ref={ref}>
      {/*  */}

      {map && (
        <mesh scale={[1, 1 / aspect, 1]} position={[0, 1.5 / aspect + 1.5, 0]}>
          <boxBufferGeometry args={[1, 1, 0.1]}></boxBufferGeometry>
          <meshBasicMaterial map={map}></meshBasicMaterial>
        </mesh>
      )}

      <Loader></Loader>

      <Suspense fallback={<></>}>
        {avatarVendor === 'temp' && (
          <TempAvatar
            setAction={setAction}
            avatarActionName={avatarActionName}
            // avatarActionIdleName={avatarActionIdleName}
            avatarActionRepeat={avatarActionRepeat}
            frustumCulled={false}
            avatarURL={avatarURLWrap}
          ></TempAvatar>
        )}

        {avatarVendor === 'rpm' && (
          <RPMAvatar
            setAction={setAction}
            avatarActionName={avatarActionName}
            // avatarActionIdleName={avatarActionIdleName}
            avatarActionRepeat={avatarActionRepeat}
            avatarURL={avatarURL}
            frustumCulled={false}
            setExporter={setExporter}
            onBeginLoading={onBeginLoading}
            onDoneLoading={onDoneLoading}
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
            // avatarActionIdleName={avatarActionIdleName}
            avatarActionRepeat={avatarActionRepeat}
            //
            exportAvatar={true}
            frustumCulled={false}
            onBeginLoading={onBeginLoading}
            onDoneLoading={onDoneLoading}
          ></ClosetAvatar>
        )}
      </Suspense>
    </group>
  )
}

//
function Loader() {
  let loader = useMetaStore((s) => s.loader)

  let jstck = useRef()
  useFrame(({ camera }) => {
    jstck.current?.lookAt(camera.position)
  })
  return (
    <group ref={jstck}>
      <group position={[0, 4, 0]} rotation={[0, 0, 0]}>
        <Text fontSize={1}>{(loader === 'loading' && 'Loading') || ''}</Text>
      </group>
    </group>
  )
}
