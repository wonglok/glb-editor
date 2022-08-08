// import { UIContent } from '@/vfx-core/UIContent'
import { ClosetBtns } from '../game-parts/ClosetBtns'
import { Floor } from '../game-parts/Floor'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
import { OnlineSystem } from '../online/OnlineSystem'

export function ChangeClothes() {
  return (
    <group>
      <Floor url={'/scene/closet/closet.glb'}></Floor>
      <HDR></HDR>
      {/*  */}

      <OnlineSystem mapID='closet'>
        <>
          <Player></Player>
          <ClosetBtns></ClosetBtns>
        </>
      </OnlineSystem>

      {/*  */}
    </group>
  )
}

//
