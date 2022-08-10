// import { UIContent } from '@/vfx-core/UIContent'
import { ClothesUI } from '../game-parts/ClothesUI'
import { Floor } from '../game-parts/Floor'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
import { Effects } from '../game-vfx/Effects'
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
          <ClothesUI></ClothesUI>
          <Effects></Effects>
        </>
      </OnlineSystem>

      {/*  */}
    </group>
  )
}

//
