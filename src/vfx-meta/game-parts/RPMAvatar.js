import { useEffect, useRef, useState } from 'react'
import { AnimationMixer } from 'three140'
import { DRACOLoader } from 'three140/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three140/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { useFrame, useThree } from '@react-three/fiber'
import { useMetaStore } from '../store/use-meta-store'
import { EffectNodeRuntime } from '@/vfx-studio/effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { Camera } from 'three'

export function RPMAvatar({
  avatarActionName = 'stand',
  avatarActionResumeOnKeyUp = 'stand',
  avatarActionRepeat = Infinity,
  avatarURL = `/rpm/rpm-avatar/loklok-christmas.glb`,
}) {
  let [glb, setGLB] = useState(false)
  let [acts, setActs] = useState(false)
  let [activeMixer, setMixer] = useState(false)

  let setAction = useMetaStore((s) => s.setAction)
  let gl = useThree((s) => s.gl)
  let camera = useThree((s) => s.camera)

  useEffect(() => {
    let loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)
    loader
      .loadAsync(avatarURL)
      .then((glbNew) => {
        glbNew.scene.traverse((it) => {
          if (it.geometry) {
            it.frustumCulled = false
          }
        })

        gl.compile(glbNew.scene, new Camera())
        setGLB(glbNew)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [avatarURL, gl, camera])

  useEffect(() => {
    if (glb) {
      let mixer = new AnimationMixer(glb.scene)
      setMixer(mixer)

      let inPlace = (animation) => {
        let item = animation?.tracks?.find(
          (e) => e.name === 'Hips.position'
        )?.values

        if (item) {
          item.map((v, i) => {
            if (i % 3 === 0) {
              item[i] = 0
            } else if (i % 3 === 1) {
              item[i] = 0
            } else {
              item[i] = v
            }
          })
        }

        return animation
      }

      Promise.all(
        JSON.parse(JSON.stringify(RPM.Motion)).map((eachSet) => {
          // return new

          return new Promise((resolve) => {
            //
            if (eachSet.loading) {
              eachSet.loading.then(() => {
                resolve(eachSet)
              })

              return
            }

            let fbxLoader = new FBXLoader()
            eachSet.loading = fbxLoader.loadAsync(eachSet.url).then((fbx) => {
              //

              let animationsList = fbx.animations

              if (eachSet.inPlace) {
                animationsList = fbx.animations.map((e) => {
                  return inPlace(e)
                })
              }

              //
              let action = mixer.clipAction(animationsList[0])
              eachSet.clip = animationsList[0]
              eachSet.clips = animationsList
              eachSet.action = action
              eachSet.duration = animationsList[0].duration
              eachSet.fbx = fbx

              //
              resolve(eachSet)
            })
          })
        })
      ).then((acts) => {
        setActs(acts)
      })

      //

      return () => {}
    }
  }, [glb])

  let tt = useRef(0)
  useEffect(() => {
    //
    if (acts && avatarActionName && activeMixer) {
      //

      let act = acts.find((a) => a.name === avatarActionName)

      if (act) {
        act.action.reset()
        act.action.repeats = act.repeats
        act.action.fadeIn(260 / 1000)
        act.action.play()
        activeMixer.update(1 / 60)

        if (avatarActionRepeat === 1) {
          clearInterval(tt.current)
          tt.current = setTimeout(() => {
            setAction(avatarActionResumeOnKeyUp, Infinity)
          }, act.duration * 1000 - 260)
        }

        //
        return () => {
          act.action.fadeOut(260 / 1000)
        }
      } else {
        setAction(avatarActionResumeOnKeyUp, Infinity)
      }
    }
  }, [
    acts,
    avatarActionName,
    activeMixer,
    setAction,
    avatarActionResumeOnKeyUp,
    avatarActionRepeat,
  ])

  useFrame((st, dt) => {
    if (activeMixer) {
      activeMixer.update(dt)
    }
  })

  //
  //
  return (
    <group>
      {/*  */}
      {/*  */}
      {glb && acts && activeMixer && (
        <>
          <primitive object={glb.scene}></primitive>
          <EffectNodeRuntime
            key={glb.scene.uuid}
            glbObject={glb}
          ></EffectNodeRuntime>
        </>
      )}
    </group>
  )
}

export const RPM = {
  Motion: [
    {
      repeats: Infinity,
      name: 'fightready',
      url: `/rpm/rpm-actions/mma-idle.fbx`,
    },
    {
      //
      name: `stand`,
      repeats: Infinity,
      url: `/rpm/rpm-pose/standing-waiting.fbx`,
    },

    //
    {
      //
      repeats: Infinity,
      name: `jump`,
      url: `/rpm/rpm-jog/jump.fbx`,
    },
    {
      inPlace: true,
      //
      repeats: Infinity,
      name: `front`,
      url: `/rpm/rpm-jog/jog-forward.fbx`,
    },
    {
      inPlace: true,

      repeats: Infinity,
      //
      name: `back`,
      url: `/rpm/rpm-jog/jog-backward.fbx`,
    },
    {
      inPlace: true,
      repeats: Infinity,

      //
      name: `left`,
      url: `/rpm/rpm-jog/jog-strafe-left.fbx`,
    },
    {
      repeats: Infinity,
      inPlace: true,

      //
      name: `right`,
      url: `/rpm/rpm-jog/jog-strafe-right.fbx`,
    },
    {
      repeats: 1,
      name: 'backflip',
      url: `/rpm/rpm-actions/back-flip.fbx`,
    },
    {
      repeats: 1,
      name: 'sidekick',
      url: `/rpm/rpm-actions/side-kick.fbx`,
    },
    {
      repeats: 1,
      name: `wramup`,
      url: `/rpm/rpm-actions/mma-warmup.fbx`,
    },
  ],
}
