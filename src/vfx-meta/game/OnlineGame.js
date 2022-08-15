// import { UIContent } from '@/vfx-core/UIContent'
// import { ClosetBtns } from '../game-parts/ClosetBtns'
import { UIContent } from '@/vfx-core/UIContent'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { BG } from '../game-parts/BG'
import { Floor } from '../game-parts/Floor'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
import { Effects } from '../game-vfx/Effects'
import { EnvLight } from '../game-vfx/EnvLight'
import { EffectButton } from '../online/EffectButton'
import { OnlineSystem } from '../online/OnlineSystem'
import { useRender } from '../store/use-render'

export function OnlineGame() {
  return (
    <group>
      <Floor url={'/scene/dome/dome3.glb'}></Floor>
      <BG url={`/hdr/moonless_golf_1k.hdr`}></BG>
      {/* <HDR></HDR> */}
      {/*  */}

      <EnvLight></EnvLight>

      <OnlineSystem mapID='dome-map'>
        <>
          <Player></Player>
        </>
      </OnlineSystem>

      {/* <Effects></Effects> */}
      {/* <TopLeft></TopLeft> */}
    </group>
  )
}

function TopLeft() {
  let setRender = useRender((s) => s.setRender)
  useEffect(() => {
    setRender(true)
  }, [setRender])
  return (
    <>
      <UIContent>
        <div className='absolute top-0 left-0 m-3 w-36'>
          <EffectButton></EffectButton>
        </div>
      </UIContent>
    </>
  )
}
