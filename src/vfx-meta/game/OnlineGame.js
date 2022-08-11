// import { UIContent } from '@/vfx-core/UIContent'
// import { ClosetBtns } from '../game-parts/ClosetBtns'
import { UIContent } from '@/vfx-core/UIContent'
import { Floor } from '../game-parts/Floor'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
import { Effects } from '../game-vfx/Effects'
import { EffectButton } from '../online/EffectButton'
import { OnlineSystem } from '../online/OnlineSystem'

export function OnlineGame() {
  return (
    <group>
      <Floor url={'/scene/dome/dome.glb'}></Floor>
      <HDR></HDR>
      {/*  */}

      <OnlineSystem mapID='dome-map'>
        <>
          <Player></Player>
          <Effects></Effects>
        </>
      </OnlineSystem>

      <TopLeft></TopLeft>
    </group>
  )
}

//

function TopLeft() {
  return (
    <>
      <UIContent>
        <div className=' absolute top-0 left-0'>
          <EffectButton></EffectButton>
        </div>
      </UIContent>
    </>
  )
}
