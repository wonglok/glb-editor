// import { UIContent } from '@/vfx-core/UIContent'
// import { ClosetBtns } from '../game-parts/ClosetBtns'
// import { UIContent } from '@/vfx-core/UIContent'
import { useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import { ARBG } from '../game-parts/ARBG'
// import { useFrame, useThree } from '@react-three/fiber'
// import { useEffect } from 'react'
import { BG, BGPng } from '../game-parts/BG'
import { FloorAR } from '../game-parts/FloorAR'
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
            {camera && <MyARButton camera={camera}></MyARButton>}
            <>
              <AvatarButton></AvatarButton>
            </>
          </>
        }
        mapID='floor_AR'
      >
        <>
          <Player isAR={true}></Player>
        </>
      </OnlineSystem>

      <ARBG></ARBG>

      <TopLeft>
        <EffectButton></EffectButton>
      </TopLeft>
    </group>
  )
}

//
