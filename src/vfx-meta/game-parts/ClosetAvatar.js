import { EffectNodeRuntime } from '@/vfx-studio/effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Camera } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { AnimationMixer } from 'three140'
import { DRACOLoader } from 'three140/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three140/examples/jsm/loaders/GLTFLoader'
import { exportGLB } from '../store/export-glb'
import { inPlace } from '../store/in-place'
import { useActions } from '../store/use-actions'
import { useMetaStore } from '../store/use-meta-store'

export let Fashion = [
  {
    name: 'basic',
    uppers: [
      {
        name: 'a',
        url: '/skinning/female3-00/upper/upper_001.glb',
      },
      {
        name: 'b',
        url: '/skinning/female3-01/upper/holo-upper.glb',
      },
    ],
    lowers: [
      {
        name: 'a',
        url: '/skinning/female3-00/lower/lower_001.glb',
      },
      {
        name: 'b',
        url: '/skinning/female3-01/lower/holo-lower.glb',
      },
    ],
    shoes: [
      {
        name: 'a',
        url: '/skinning/female3-00/shoes/shoes_001.glb',
      },
      {
        name: 'b',
        url: '/skinning/female3-01/shoes/shoes.glb',
      },
    ],
    combinedMotion: {
      //
      url: `/skinning/motions_glb/fbx/combined-motion.glb`,
    },
    motions: [
      //
      { name: 'stand', repeats: Infinity, url: '/skinning/motions/stand.fbx' },
      {
        name: 'backflip',
        repeats: 1,
        url: '/skinning/motions/backflip.fbx',
      },
      {
        inPlace: true,
        name: 'back',
        repeats: Infinity,
        url: '/skinning/motions/backward.fbx',
      },
      {
        inPlace: true,
        name: 'front',
        repeats: Infinity,
        url: '/skinning/motions/forward.fbx',
      },
      { name: 'jump', repeats: Infinity, url: '/skinning/motions/jump.fbx' },
      {
        name: 'right',
        inPlace: true,
        repeats: Infinity,
        url: '/skinning/motions/right-strafe.fbx',
      },
      {
        name: 'left',
        repeats: Infinity,
        url: '/skinning/motions/left-strafe.fbx',
      },
      {
        name: 'right',
        repeats: Infinity,
        url: '/skinning/motions/right-strafe.fbx',
      },
      {
        name: 'fightready',
        repeats: 1,
        url: '/skinning/motions/mma-idle.fbx',
      },
      {
        name: 'sidekick',
        repeats: 1,
        url: '/skinning/motions/side-kick.fbx',
      },
      {
        name: 'warmup',
        repeats: 1,
        url: '/skinning/motions/warming-up.fbx',
      },
    ],
  },
]

export let get = (v, gl, cam) => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/')
  useMetaStore.getState().setStartLoading()
  let loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  return loader
    .loadAsync(v)
    .then((glbNew) => {
      // glbNew.scene.traverse((it) => {
      //   if (it.geometry) {
      //     it.frustumCulled = false
      //   }
      // })

      if (cam && gl) {
        gl.compile(glbNew.scene, cam)
      }
      useMetaStore.getState().setDoneLoading()

      return glbNew
    })
    .catch((e) => {
      console.log(e)

      useMetaStore.getState().setDoneLoading()

      return false
    })
}

export function ClosetAvatar({
  //]
  frustumCulled = true,
  avatarActionName = 'stand',
  avatarActionResumeOnKeyUp = 'stand',
  avatarActionRepeat = Infinity,
  avatarActionIdleName = 'stand',

  avatarFashionSeries = Fashion[0],
  avatarPartSkeleton = Fashion[0].uppers[0].url,
  avatarPartUpper = Fashion[0].uppers[0].url,
  avatarPartLower = Fashion[0].lowers[0].url,
  avatarPartShoes = Fashion[0].shoes[0].url,

  setAction,
  exportAvatar = false,

  onBeginLoading = () => {},
  onDoneLoading = () => {},
}) {
  let gl = useThree((s) => s.gl)
  let camera = useThree((s) => s.camera)
  let avatarGroup = useRef()

  let [skeleton, setSkeleton] = useState(false)
  let [hips, setHips] = useState(false)
  let [base, setBase] = useState(false)
  let [acts, setActs] = useState([])

  let [mixer] = useState(() => {
    return new AnimationMixer()
  })

  useFrame((st, dt) => {
    mixer.update(dt)
  })

  //
  useEffect(() => {
    let fbxLoader = new FBXLoader()
    // let = Fashion.combinedMotion.url

    let comebinedURL = avatarFashionSeries.combinedMotion.url
    let useCombined = comebinedURL
    Promise.all([
      get(avatarPartSkeleton, gl, camera),
      useCombined
        ? get(comebinedURL, gl, camera)
        : Promise.all([
            //

            ...avatarFashionSeries.motions.map((mo) => {
              return fbxLoader.loadAsync(mo.url).then((fbx) => {
                mo.fbx = fbx

                return mo
              })
            }),
          ]),
    ]).then(([base, actions]) => {
      //
      //
      if (useCombined) {
        let acts = []

        actions.animations
          .map((e) => {
            return inPlace(e)
          })
          .forEach((it) => {
            //

            let newEntry = {
              name: it.name,
              clip: it,
              action: mixer.clipAction(it, base.scene),
              duration: it.duration,
            }

            acts.push(newEntry)
          })

        setActs(acts)
        //
      } else {
        //
        let acts = actions.slice().map((mo) => {
          mo = {
            ...mo,
          }

          let animationsList = mo.fbx.animations

          animationsList = animationsList.map((e) => {
            return inPlace(e)
          })

          mo.clip = animationsList[0]
          mo.action = mixer.clipAction(animationsList[0], base.scene)
          mo.duration = animationsList[0].duration
          return mo
        })

        setActs(acts)
      }

      if (base) {
        setBase(base)

        base.scene.traverse((obj) => {
          if (obj.skeleton) {
            setSkeleton(obj.skeleton)
          }
        })

        base.scene.traverse((obj) => {
          if (obj && obj.isBone && obj.name.includes('Hips')) {
            setHips(obj)
          }
        })
      }
    })
  }, [avatarPartSkeleton, mixer, gl, camera])

  //

  useActions({
    acts,
    avatarActionName,
    activeMixer: mixer,
    setAction,
    avatarActionIdleName,
    avatarActionResumeOnKeyUp,
    avatarActionRepeat,
  })

  return (
    <group position={[0, 0, 0]}>
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/* {base && <primitive object={base.scene}></primitive>} */}
      {/*  */}

      <group
        ref={avatarGroup}
        name={'Armature'}
        rotation={[-Math.PI * 0.5, 0, 0]}
      >
        {skeleton && hips && base && mixer && (
          <>
            <>
              <primitive object={hips} />

              <Suspense fallback={null}>
                <Generic
                  frustumCulled={frustumCulled}
                  mixer={mixer}
                  skeleton={skeleton}
                  url={avatarPartUpper}
                ></Generic>
              </Suspense>
              <Suspense fallback={null}>
                <Generic
                  frustumCulled={frustumCulled}
                  mixer={mixer}
                  skeleton={skeleton}
                  url={avatarPartLower}
                ></Generic>
              </Suspense>
              <Suspense fallback={null}>
                <Generic
                  frustumCulled={frustumCulled}
                  mixer={mixer}
                  skeleton={skeleton}
                  url={avatarPartShoes}
                ></Generic>
              </Suspense>
            </>
          </>
        )}
      </group>
      {exportAvatar && (
        <Exporter
          clips={acts.map((e) => e.clip)}
          group={avatarGroup}
          mixer={mixer}
        ></Exporter>
      )}
    </group>
  )
}

function Exporter({ clips, group, mixer }) {
  let setExporter = useMetaStore((s) => s.setExporter)
  useEffect(() => {
    if (group.current && clips && mixer) {
      setExporter({ clips, group: group.current, mixer })
    }
  }, [group, setExporter, clips, mixer])

  return null
}

function Generic({ frustumCulled, skeleton, url, mixer }) {
  let [skinnedMeshes, setSkinMeshes] = useState([])
  let gl = useThree((s) => s.gl)
  let camera = useThree((s) => s.camera)
  useEffect(() => {
    get(url, gl, camera).then((glb) => {
      if (frustumCulled === false) {
        glb.scene.traverse((it) => {
          if (it.geometry) {
            it.frustumCulled = false
          }
        })
      }

      glb.scene.traverse((it) => {
        if (it.isSkinnedMesh) {
          it.skeleton = skeleton
        }
      })
      mixer.update(1 / 60)
      setSkinMeshes(
        <>
          <EffectNodeRuntime
            key={glb.scene.uuid}
            glbObject={glb}
          ></EffectNodeRuntime>
          <primitive object={glb.scene}></primitive>
        </>
      )
    })

    return () => {
      //
    }
  }, [url, gl, skeleton, camera, mixer])

  return <group>{skinnedMeshes}</group>
}
