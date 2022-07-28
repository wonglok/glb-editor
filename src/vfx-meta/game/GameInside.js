import { Floor } from '../game-parts/Floor'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'

export function Gameinside() {
  return (
    <group>
      <Player></Player>
      <Floor></Floor>
      <HDR></HDR>
    </group>
  )
}

//
