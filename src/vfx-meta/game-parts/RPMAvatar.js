import { useEffect, useRef, useState } from 'react'
import { AnimationMixer } from 'three140'
import { DRACOLoader } from 'three140/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three140/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { useFrame, useThree } from '@react-three/fiber'
import { useMetaStore } from '../store/use-meta-store'
import { EffectNodeRuntime } from '@/vfx-studio/effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { Camera } from 'three'
import { inPlace } from '../store/in-place'
import { useActions } from '../store/use-actions'

export function RPMAvatar({
  frustumCulled = true,
  setAction,
  avatarActionName = 'stand',
  avatarActionResumeOnKeyUp = 'stand',
  avatarActionRepeat = Infinity,
  avatarActionIdleName = 'stand',
  avatarURL = `/rpm/rpm-avatar/loklok-christmas.glb`,
  onBeginLoading = () => {},
  onDoneLoading = () => {},
}) {
  let [glb, setGLB] = useState(false)
  let [acts, setActs] = useState(false)
  let [activeMixer, setMixer] = useState(false)

  let gl = useThree((s) => s.gl)
  let camera = useThree((s) => s.camera)

  useEffect(() => {
    onBeginLoading()
    let loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)
    loader
      .loadAsync(avatarURL)
      .then((glbNew) => {
        if (frustumCulled === false) {
          glbNew.scene.traverse((it) => {
            if (it.geometry) {
              it.frustumCulled = false
            }
          })
        }

        onDoneLoading()

        gl.compile(glbNew.scene, new Camera())
        setGLB(glbNew)
      })
      .catch((e) => {
        console.log(e)
        onDoneLoading()
      })
  }, [avatarURL, gl, camera, frustumCulled])

  useEffect(() => {
    if (glb) {
      let mixer = new AnimationMixer(glb.scene)
      setMixer(mixer)
      onBeginLoading()
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
      ).then(
        (acts) => {
          setActs(acts)
          onDoneLoading()
        },
        () => {
          onDoneLoading()
        }
      )

      //

      return () => {}
    }
  }, [glb])

  // let tt = useRef(0)
  // useEffect(() => {
  //   //
  //   if (acts && avatarActionName && activeMixer) {
  //     //

  //     let act = acts.find((a) => a.name === avatarActionName)

  //     if (act) {
  //       act.action.reset()
  //       act.action.repeats = act.repeats
  //       act.action.fadeIn(260 / 1000)
  //       act.action.play()
  //       activeMixer.update(1 / 60)

  //       if (avatarActionRepeat === 1) {
  //         clearInterval(tt.current)
  //         tt.current = setTimeout(() => {
  //           setAction(avatarActionResumeOnKeyUp, Infinity)
  //         }, act.duration * 1000 - 260)
  //       }

  //       //
  //       return () => {
  //         act.action.fadeOut(260 / 1000)
  //       }
  //     } else {
  //       setAction(avatarActionIdleName, Infinity)
  //     }
  //   }
  // }, [
  //   acts,
  //   avatarActionName,
  //   activeMixer,
  //   setAction,
  //   avatarActionResumeOnKeyUp,
  //   avatarActionIdleName,
  //   avatarActionRepeat,
  // ])

  useActions({
    acts,
    avatarActionName,
    activeMixer: activeMixer,
    setAction,
    avatarActionIdleName,
    avatarActionResumeOnKeyUp,
    avatarActionRepeat,
  })

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

    //
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
      name: `warmup`,
      url: `/rpm/rpm-actions/mma-warmup.fbx`,
    },
  ],
}
