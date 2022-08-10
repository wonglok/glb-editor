// import { UIContent } from '@/vfx-core/UIContent'
// import { ClosetBtns } from '../game-parts/ClosetBtns'
import { Floor } from '../game-parts/Floor'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
import { Effects } from '../game-vfx/Effects'
import { OnlineSystem } from '../online/OnlineSystem'

export function Chatroom() {
  return (
    <group>
      <Floor url={'/scene/chatroom/chat-room-v2.glb'}></Floor>
      <HDR></HDR>
      {/*  */}

      <OnlineSystem mapID='chat-room-v2.glb'>
        <>
          <Player></Player>

          <Effects></Effects>
        </>
      </OnlineSystem>

      {/*  */}
      {/* <ClosetBtns></ClosetBtns> */}
    </group>
  )
}

//
