import { useMetaStore } from '../store/use-meta-store'
import { OtherOnePlayer } from '../game-parts/OtherOnePlayer'

export function OtherPlayers() {
  let players = useMetaStore((s) => s.players)
  return (
    <>
      {players.map((e) => {
        return (
          <group key={e.uid}>
            <OtherOnePlayer otherPlayer={e}></OtherOnePlayer>
          </group>
        )
      })}

      {/*  */}
      {/*  */}
    </>
  )
}
