import { UIContent } from '@/vfx-core/UIContent'
import { ClosetBtns } from '../game-parts/ClosetBtns'
import { Floor } from '../game-parts/Floor'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
import { LoginDetect } from '../online/LoginDetect'

export function ChangeClothes() {
  return (
    <group>
      <Player></Player>
      <Floor url={'/scene/dome/dome.glb'}></Floor>
      <HDR></HDR>
      {/*  */}

      <LoginDetect></LoginDetect>

      {/*  */}
      <ClosetBtns></ClosetBtns>
    </group>
  )
}

//
