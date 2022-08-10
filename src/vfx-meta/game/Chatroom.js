// import { UIContent } from '@/vfx-core/UIContent'
// import { ClosetBtns } from '../game-parts/ClosetBtns'
import { UIContent } from '@/vfx-core/UIContent'
import { ContactShadows } from '@react-three/drei'
import { Conf } from '../game-parts/Conf'
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

      <OnlineSystem mapID='/scene/chatroom/chat-room-v2.glb'>
        <>
          <Player></Player>

          <Effects></Effects>

          <UIContent>
            <div className=' absolute top-0 left-0 w-96 '>
              <Conf></Conf>
            </div>
          </UIContent>
        </>
      </OnlineSystem>

      {/*  */}
      {/* <ClosetBtns></ClosetBtns> */}
    </group>
  )
}

//
