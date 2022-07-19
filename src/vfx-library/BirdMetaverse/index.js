import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
// import { Starter } from './Starter'
import { TJLab, TJType } from '../SharedCommons/sayTJ'
// import { SimpleBloomer } from '../SharedCommons/SimpleBloomer'
// import { JustBloom } from '../SharedCommons/JustBloom'
import { lighting } from '../SharedCommons/lighting'
import { BirdMapGame } from './BirdMapGame'
import { Joy } from '../SharedCommons/AvatarSkin'
import { firebaseConfig } from 'firebase.config'
import { glow } from '../SharedCommons/glow'
import { Core } from '@/vfx-core/Core'
import { useFrame } from '@react-three/fiber'

//
export default function BirdMetaverse({
  resetPosition = [0, 1.5, 0],
  firstPerson = false,
  mapURL = `/scene/dome/dome.glb`,
  onDoneMap = () => {},
  onDoneMyAvatar = () => {},
  children = null,
}) {
  useFrame(() => {
    // Core.work()
  }, 1000)

  // //
  useEffect(() => {}, [])
  return (
    <>
      <Suspense fallback={null}>
        <TJLab
          //
          init={({ api }) => {
            //
            Core.now.canvas = api

            Core.onLoop(() => {
              api.work()
            })

            lighting({
              api,
            })

            api.now.gl.setAnimationLoop(() => {
              Core.work()
              api.now.gl.render(api.now.scene, api.now.camera)
            })

            // glow({ vfx: api })

            Joy.preloadActions()

            new BirdMapGame({
              api,
              onDone: onDoneMap,
              onDoneMyAvatar: onDoneMyAvatar,

              params: {
                firstPerson,
                resetPosition: resetPosition,
                firebaseConfig: firebaseConfig,
                mapURL,
                // mapURL: `/Metaverse/places/lobby/hall-v2-v1.glb`,
                // mapURL: `/Metaverse/places/theatre-large/theatre-larger-one-v1.glb`,
                // mapURL: `/Metaverse/places/tvstudio/tv-studio-v1.glb`,
                // mapURL: `/Metaverse/places/theatre-small/low-res-cinema-v1.glb`,
                // mapURL: `/Metaverse/places/dome/dome.glb`,
              },
            })
          }}
        ></TJLab>
      </Suspense>
      {children}
    </>
  )
}
