// import { UIContent } from '@/vfx-core/UIContent'
// import { ClosetBtns } from '../game-parts/ClosetBtns'
import { UIContent } from '@/vfx-core/UIContent'
import { Text } from '@react-three/drei'
import { Suspense } from 'react'
import { Conf } from '../game-parts/Conf'
import { Floor } from '../game-parts/Floor'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
import { OnlineSystem } from '../online/OnlineSystem'
import { Effects } from '../game-vfx/Effects'
import { useRender } from '../store/use-render'

export function Chatroom() {
  return (
    <group>
      <Suspense
        fallback={
          <Text color={'black'} fontSize={0.25}>
            Loading...
          </Text>
        }
      >
        <Floor url={'/scene/chatroom/chat-room-v2-v2.glb'}></Floor>
        <HDR></HDR>
        {/*  */}

        <OnlineSystem mapID='/scene/chatroom/chat-room-v2-v2.glb'>
          <>
            <Player></Player>

            <Effects></Effects>

            <UIContent>
              <div
                className=' absolute  flex items-center justify-center '
                style={{
                  top: 'calc(50vh - 300px / 2)',
                  left: 'calc(50vw - 300px / 2)',
                  width: '300px',
                  height: '300px',
                }}
              >
                <Conf></Conf>
              </div>
            </UIContent>
          </>
        </OnlineSystem>
      </Suspense>

      <TopLeft></TopLeft>

      {/* <ClosetBtns></ClosetBtns> */}
    </group>
  )
}

//

//

//

function TopLeft() {
  const enable = useRender((s) => s.enable)
  const setRender = useRender((s) => s.setRender)

  return (
    <>
      <UIContent>
        <div className='absolute top-0 left-0'>
          <button
            className='p-2 bg-white'
            onClick={() => {
              //
              setRender(!enable)
            }}
          >
            Toggle Render
          </button>
        </div>
      </UIContent>
    </>
  )
}
