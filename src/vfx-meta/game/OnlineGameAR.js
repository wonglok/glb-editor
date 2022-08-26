// import { UIContent } from '@/vfx-core/UIContent'
// import { ClosetBtns } from '../game-parts/ClosetBtns'
// import { UIContent } from '@/vfx-core/UIContent'
import { UIContent } from '@/vfx-core/UIContent'
import { Html } from '@react-three/drei'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import { DoubleSide, FrontSide } from 'three'
import { CatmullRomCurve3, Vector2, Vector3 } from 'three140'
import { ARBG } from '../game-parts/ARBG'
// import { useFrame, useThree } from '@react-three/fiber'
// import { useEffect } from 'react'
import { BG, BGPng } from '../game-parts/BG'
import { BottomRight } from '../game-parts/BottomRight'
import { FloorAR } from '../game-parts/FloorAR'
import { Gun, GunUI, useGun } from '../game-parts/Gun'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
import { TopLeft } from '../game-parts/TopLeft'
import { AvatarButton } from '../online/AvatarButton'
import { ChatButton } from '../online/ChatButton'
// import { Effects } from '../game-vfx/Effects'
// import { EnvLight } from '../game-vfx/EnvLight'
import { EffectButton } from '../online/EffectButton'
import { MyARButton } from '../online/MyARButton'
import { OnlineSystem } from '../online/OnlineSystem'

export function OnlineGameAR() {
  let camera = useThree((s) => s.camera)
  return (
    <group>
      {/*  */}
      {/*  */}

      <Suspense fallback={null}></Suspense>
      <BGPng url={`/bg/galaxy2048.png`}></BGPng>
      <HDR url={`/hdr/moonless_golf_1k.hdr`}> </HDR>
      <FloorAR></FloorAR>
      {/*  */}
      {/* <EnvLight></EnvLight> */}

      <OnlineSystem
        btnTR={
          <>
            <>{/* <AvatarButton></AvatarButton> */}</>
          </>
        }
        mapID='floor_AR'
      >
        <>
          <Player isAR={true}></Player>
        </>
      </OnlineSystem>

      <UIContent>
        <div
          className='fixed '
          style={{ top: '50%', left: 'calc(50% - 200px / 2)' }}
        >
          {camera && <MyARButton camera={camera}></MyARButton>}
        </div>
      </UIContent>

      {/* <ARBG></ARBG> */}

      <Aim></Aim>
      <Gun></Gun>

      <TopLeft>
        <EffectButton></EffectButton>
      </TopLeft>

      <BottomRight>
        <GunUI></GunUI>
      </BottomRight>
    </group>
  )
}

//

function Aim() {
  let to = useGun((s) => s.to)
  let from = useGun((s) => s.from)
  let v00 = new Vector2(0, 0)
  let camera = useThree((s) => s.camera)
  let raycastball = useRef()
  let rayAim = useRef()
  useFrame(({ raycaster, camera, mouse }) => {
    if (raycastball.current && rayAim.current) {
      raycaster.setFromCamera(v00, camera)
      let res = raycaster.intersectObject(raycastball.current, false)

      if (res && res[0]) {
        let first = res[0]

        if (first) {
          from.copy(camera.position)
          to.copy(rayAim.current.position)
          rayAim.current.position.lerp(first.point, 0.1)

          console.log(to)
        }
      }
      //
    }
    //
  })

  return (
    <>
      <mesh
        visible={false}
        ref={raycastball}
        name={'raycastBallDestination'}
        frustumCulled={false}
      >
        <sphereBufferGeometry args={[150, 32, 32]}></sphereBufferGeometry>
        <meshStandardMaterial
          side={DoubleSide}
          transparent={true}
          opacity={1}
        ></meshStandardMaterial>
      </mesh>

      <mesh ref={rayAim}>
        <sphereBufferGeometry args={[1.0, 24, 24]}></sphereBufferGeometry>
        <meshPhysicalMaterial
          transmission={1}
          roughness={0}
          thickness={1}
          color='#00ff00'
        ></meshPhysicalMaterial>
      </mesh>

      {createPortal(
        <>
          <group position={[0, 0, -25]}>
            <mesh name='aim'>
              <sphereBufferGeometry args={[0.1, 24, 24]}></sphereBufferGeometry>
              <meshPhysicalMaterial
                transmission={1}
                roughness={0}
                thickness={1}
                color='#ff0000'
              ></meshPhysicalMaterial>
            </mesh>
          </group>
        </>,
        camera
      )}

      <primitive object={camera}> </primitive>
    </>
  )
}

//
