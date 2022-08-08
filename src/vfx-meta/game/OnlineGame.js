// import { UIContent } from '@/vfx-core/UIContent'
// import { ClosetBtns } from '../game-parts/ClosetBtns'
import { Floor } from '../game-parts/Floor'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
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
        </>
      </OnlineSystem>

      {/*  */}
      {/* <ClosetBtns></ClosetBtns> */}
    </group>
  )
}

//
