import { ClosetBtns } from '../game-parts/ClosetBtns'
import { Floor } from '../game-parts/Floor'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'

export function Gameinside() {
  return (
    <group>
      <Player></Player>
      <Floor url={'/scene/dome/dome.glb'}></Floor>
      <HDR></HDR>
      <ClosetBtns></ClosetBtns>
    </group>
  )
}

//
