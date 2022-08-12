// import { UIContent } from '@/vfx-core/UIContent'
// import { ClosetBtns } from '../game-parts/ClosetBtns'
import { UIContent } from '@/vfx-core/UIContent'
import { Floor } from '../game-parts/Floor'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
import { Effects } from '../game-vfx/Effects'
import { EnvLight } from '../game-vfx/EnvLight'
import { EffectButton } from '../online/EffectButton'
import { OnlineSystem } from '../online/OnlineSystem'

export function OnlineGame() {
  return (
    <group>
      <Floor url={'/scene/dome/dome1.glb'}></Floor>
      {/* <HDR></HDR> */}
      {/*  */}

      <EnvLight></EnvLight>

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
        <div className='absolute top-0 left-0 m-3 w-36'>
          <EffectButton></EffectButton>
        </div>
      </UIContent>
    </>
  )
}

//
