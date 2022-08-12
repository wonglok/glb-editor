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
import { useTwilio } from '../store/use-twilio'

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

            <Center></Center>
          </>
        </OnlineSystem>
      </Suspense>

      <TopLeft></TopLeft>

      {/* <ClosetBtns></ClosetBtns> */}
    </group>
  )
}

//

function Center() {
  let room = useTwilio((s) => s.room)
  return (
    <UIContent>
      <div
        className='absolute flex items-center justify-center -z-10'
        style={
          room
            ? {
                top: '0px',
                left: '0px',
              }
            : {
                top: 'calc(50vh - 300px / 2)',
                left: 'calc(50vw - 300px / 2)',
                width: '300px',
                height: '300px',
              }
        }
      >
        <Conf></Conf>
      </div>
    </UIContent>
  )
}

function TopLeft() {
  const enable = useRender((s) => s.enable)
  const setRender = useRender((s) => s.setRender)

  return (
    <>
      <UIContent>
        <div className='absolute top-0 left-0'>
          <button
            className='p-3 m-3 bg-white rounded-lg'
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

//
