import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
// import { Starter } from './Starter'
import { TJLab, TJType } from '../SharedCommons/sayTJ'
// import { SimpleBloomer } from '../SharedCommons/SimpleBloomer'
// import { JustBloom } from '../SharedCommons/JustBloom'
import { lighting } from '../SharedCommons/lighting'
import { Joy } from '../SharedCommons/AvatarSkin'
import { firebaseConfig } from 'firebase.config'
import { glow } from '../SharedCommons/glow'
import { Core } from '@/vfx-core/Core'
import { useFrame, useThree } from '@react-three/fiber'
import { XRMapGame } from './XRMapGame'
import { meshBound } from '@react-three/drei'
import {
  DefaultXRControllers,
  Hands,
  Interactive,
  useInteraction,
  useXR,
} from '@react-three/xr'
import { Object3D } from 'three'
import { UIContent } from '@/vfx-core/UIContent'
//
export default function XRMetaverse({
  resetPosition = [0, 1.5, 0],
  firstPerson = false,
  mapURL = `/scene/dome/dome.glb`,
  onDoneMap = () => {},
  onDoneMyAvatar = () => {},
  children = null,
}) {
  // useFrame(() => {
  //   // Core.work()
  // }, 1000)

  let { player: xrPlayer } = useXR()
  // //

  useFrame(() => {
    Core.work()
  })

  const { gl, camera } = useThree()

  // const controllers = useXR((state) => state.controllers)

  let group = useRef()
  // let [name, setName] = useState('clicked')
  useInteraction(group, 'onSelect', (event) => {
    console.log(event)
    // setName(event.target.name)
    if (event.intersections && event.intersections[0]) {
      Core.now.goToPlace.position.copy(event.intersections[0].point)
    }
  })

  return (
    <>
      <UIContent>
        <div className='fixed top-0 left-0 z-50 p-2 bg-white'>{name}</div>
      </UIContent>
      <Suspense fallback={null}>
        {xrPlayer && (
          <>
            <DefaultXRControllers
              /** Optional material props to pass to controllers' ray indicators */
              rayMaterial={{ color: 'blue' }}
              /** Whether to hide controllers' rays on blur. Default is `false` */
              hideRaysOnBlur={false}
            />
            <group raycast={meshBound} ref={group}>
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

                  // api.now.gl.setAnimationLoop(() => {
                  //   Core.work()
                  //   api.now.gl.render(api.now.scene, api.now.camera)
                  // })

                  // glow({ vfx: api })

                  Joy.preloadActions()

                  new XRMapGame({
                    xrPlayer: xrPlayer,
                    api,
                    onDone: onDoneMap,
                    onDoneMyAvatar: onDoneMyAvatar,

                    mounter: group.current,

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
            </group>
          </>
        )}
      </Suspense>

      {children}
    </>
  )
}
