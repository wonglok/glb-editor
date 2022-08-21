// import { UIContent } from '@/vfx-core/UIContent'
// import { ClosetBtns } from '../game-parts/ClosetBtns'
// import { UIContent } from '@/vfx-core/UIContent'
import { Suspense } from 'react'
import { ARBG } from '../game-parts/ARBG'
// import { useFrame, useThree } from '@react-three/fiber'
// import { useEffect } from 'react'
import { BG, BGPng } from '../game-parts/BG'
import { Floor } from '../game-parts/Floor'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
import { TopLeft } from '../game-parts/TopLeft'
// import { Effects } from '../game-vfx/Effects'
// import { EnvLight } from '../game-vfx/EnvLight'
import { EffectButton } from '../online/EffectButton'
import { OnlineSystem } from '../online/OnlineSystem'

export function OnlineGame() {
  return (
    <group>
      {/*  */}

      <Suspense fallback={null}></Suspense>
      {/* <EnvLight></EnvLight> */}

      <OnlineSystem mapID='/scene/landing/os.glb'>
        <>
          <BGPng url={`/bg/galaxy2048.png`}></BGPng>
          <HDR url={`/hdr/moonless_golf_1k.hdr`}> </HDR>
          <Floor url={'/scene/landing/os-effect.glb'}></Floor>
          <Player></Player>
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
