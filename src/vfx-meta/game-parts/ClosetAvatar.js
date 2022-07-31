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

let get = (v, gl, cam) => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/')

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
      return glbNew
    })
    .catch((e) => {
      console.log(e)

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

  avatarPartSkeleton = Fashion[0].uppers[0].url,
  avatarPartUpper = Fashion[0].uppers[0].url,
  avatarPartLower = Fashion[0].lowers[0].url,
  avatarPartShoes = Fashion[0].shoes[0].url,

  setAction,
  exportAvatar = false,

  //
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

    Promise.all([
      get(avatarPartSkeleton, gl, camera),
      Promise.all([
        //

        ...Fashion[0].motions.map((mo) => {
          return fbxLoader.loadAsync(mo.url).then((fbx) => {
            mo.fbx = fbx

            return mo
          })
        }),
      ]),
    ]).then(([base, actions]) => {
      //
      //
      //
      let acts = actions.slice().map((mo) => {
        mo = {
          ...mo,
        }

        let animationsList = mo.fbx.animations

        animationsList = animationsList.map((e) => {
          return inPlace(e)
        })

        mo.action = mixer.clipAction(animationsList[0], base.scene)
        mo.duration = animationsList[0].duration
        return mo
      })

      setActs(acts)

      if (base) {
        setBase(base)

        base.scene.traverse((obj) => {
          if (obj.skeleton) {
            setSkeleton(obj.skeleton)
          }
        })

        base.scene.traverse((obj) => {
          if (obj.isBone && obj.name.includes('Hips')) {
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

      <group ref={avatarGroup}>
        {skeleton && hips && base && mixer && (
          <>
            <group>
              <group>
                <group>
                  <group name={'Armature'} rotation={[-Math.PI * 0.5, 0, 0]}>
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

                    {exportAvatar && <Exporter group={avatarGroup}></Exporter>}
                  </group>
                </group>
              </group>
            </group>
          </>
        )}
      </group>
    </group>
  )
}

function Exporter({ group }) {
  let setExporter = useMetaStore((s) => s.setExporter)
  useEffect(() => {
    setExporter({ clips: [], group: group.current })
  }, [group, setExporter])

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
