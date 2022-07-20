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
  useController,
  useInteraction,
  useXR,
  useXREvent,
} from '@react-three/xr'
import { Object3D, Raycaster, Vector3 } from 'three'
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

  let { player: xrPlayer, controllers } = useXR()
  // //

  // console.log(controllers)
  let group = useRef(new Object3D())

  useEffect(() => {
    let canRun = true
    //controllers
    if (controllers && controllers.length > 0) {
      controllers.forEach((it, idx) => {
        let wp = new Vector3()
        let wd = new Vector3()
        let raycaster = new Raycaster()
        Core.onLoop(() => {
          if (it && canRun) {
            //
            //

            it.parent.getWorldPosition(wp)
            it.parent.getWorldDirection(wd)

            raycaster.set(wp, wd)
            raycaster.firstHitOnly = true
            let hit = raycaster.intersectObjects([group.current])
            if (hit && hit[0]) {
              if (idx === 0) {
                hit[0].object.getWorldPosition(Core.now.onHover0.position)
              } else if (idx === 1) {
                hit[0].object.getWorldPosition(Core.now.onHover1.position)
                //
              }
            }

            //
            //
          }
        })
      })
    }

    return () => {
      canRun = false
    }
  }, [controllers])

  useFrame(() => {
    Core.work()
  })

  const { gl, camera, scene } = useThree()

  // const controllers = useXR((state) => state.controllers)

  // let [name, setName] = useState('clicked')
  useInteraction(group, 'onSelect', (event) => {
    // setName(event.target.name)
    if (event.intersections && event.intersections[0]) {
      Core.now.goToPlace.position.copy(event.intersections[0].point)
    }
  })

  // useInteraction(group, 'onHover', (event) => {
  //   // setName(event.target.name)
  //   if (event.intersections && event.intersections[0]) {
  //     Core.now.onHover0.position.copy(event.intersections[0].point)
  //   }
  // })

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

                  mounter: scene,

                  casterGroup: group.current,

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
          </>
        )}
      </Suspense>

      {children}
    </>
  )
}
