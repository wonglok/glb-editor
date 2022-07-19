import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { AnimationMixer, Vector3 } from 'three'
import { TJCore } from '@/vfx-core/TJCore.js'
import { Core } from '@/vfx-core/Core'
// import { set } from 'firebase-v9/database'
// import { iRayMouse, useSandForCharacter } from "../RiggedGPU/RiggedGPU.js";

export const loadGLTF = (url) => {
  return new Promise((resolve) => {
    //

    // const IS_IOS =
    //   /^(iPad|iPhone|iPod)/.test(window.navigator.platform) ||
    //   (/^Mac/.test(window.navigator.platform) &&
    //     window.navigator.maxTouchPoints > 1);
    // if (IS_IOS) {
    //   window.createImageBitmap = undefined;
    // }

    let loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)
    loader.crossOrigin = true

    loader.load(url, (res) => {
      resolve(res)
    })
  })
}

let map = new Map()
let fbxLoader = new FBXLoader()
export class Joy {
  static async loadAsync(url) {
    if (map.has(url)) {
      return map.get(url)
    } else {
      let fbx = await fbxLoader.loadAsync(url)
      map.set(url, fbx)
      return fbx
    }
  }

  static async preloadActions() {
    return {
      front: Joy.loadAsync(`/rpm/rpm-jog/jog-forward.fbx`),
      // back: Joy.loadAsync(`/rpm/rpm-jog/jog-backward.fbx`),
      // left: Joy.loadAsync(`/rpm/rpm-jog/jog-strafe-left.fbx`),
      // right: Joy.loadAsync(`/rpm/rpm-jog/jog-strafe-right.fbx`),
      // frontDiag1: Joy.loadAsync(`/rpm/rpm-jog/jog-forward-diagonal.fbx`),
      // frontDiag2: Joy.loadAsync(`/rpm/rpm-jog/jog-forward-diagonal-2.fbx`),
      // backDiag1: Joy.loadAsync(`/rpm/rpm-jog/jog-backward-diagonal.fbx`),
      // backDiag2: Joy.loadAsync(`/rpm/rpm-jog/jog-backward-diagonal-2.fbx`),
      standing: Joy.loadAsync(`/rpm/rpm-jog/standing.fbx`),
      // jump: Joy.loadAsync(`/rpm/rpm-jog/jump.fbx`),
    }
  }
}

export class AvatarSkin {
  constructor({
    api,
    avatarURL = `/Metaverse/avatar/lok-office.glb`,
    player,
    state,
    controls,
    params,
    onDoneMyAvatar,
  }) {
    this.clean = () => {
      let tt = setInterval(() => {
        if (this.innerClean) {
          clearInterval(tt)
          this.innerClean()
        }
      })
    }

    let init = async () => {
      let sub = new TJCore({ parent: api, name: 'main player ' + avatarURL })
      Core.onLoop(() => {
        sub.work()
      })
      let scene = await api.ready.scene
      let avatarGLB = await loadGLTF(avatarURL)
      let mixer = new AnimationMixer(avatarGLB.scene)

      player.visible = false

      this.innerClean = () => {
        sub.clean()
      }

      avatarGLB.scene.traverse((it) => {
        if (it) {
          it.frustumCulled = false
        }
      })

      api.now.pointer3D = new Vector3()
      api.now.charMounter = avatarGLB.scene

      sub.onLoop(() => {})

      // if (!api.now.charMounter) {
      //   iRayMouse({
      //     sub,
      //     api,
      //     myMounter: avatarGLB.scene,
      //     myPointer: api.now.pointer3D,
      //   });
      // }

      // useSandForCharacter({ o3d: avatarGLB.scene, api: sub });

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
      }
      let processClip = ({ animations }) => {
        inPlace(animations[0])
        return mixer.clipAction(animations[0])
      }
      // let fbxLoader = new FBXLoader();
      let actions = {
        front: await Joy.loadAsync(`/rpm/rpm-jog/jog-forward.fbx`).then(
          processClip
        ),
        // back: await Joy.loadAsync(`/rpm/rpm-jog/jog-backward.fbx`).then(
        //   processClip
        // ),
        // left: await Joy.loadAsync(`/rpm/rpm-jog/jog-strafe-left.fbx`).then(
        //   processClip
        // ),
        // right: await Joy.loadAsync(`/rpm/rpm-jog/jog-strafe-right.fbx`).then(
        //   processClip
        // ),

        // frontDiag1: await Joy.loadAsync(
        //   `/rpm/rpm-jog/jog-forward-diagonal.fbx`
        // ).then(processClip),
        // frontDiag2: await Joy.loadAsync(
        //   `/rpm/rpm-jog/jog-forward-diagonal-2.fbx`
        // ).then(processClip),
        // backDiag1: await Joy.loadAsync(
        //   `/rpm/rpm-jog/jog-backward-diagonal.fbx`
        // ).then(processClip),
        // backDiag2: await Joy.loadAsync(
        //   `/rpm/rpm-jog/jog-backward-diagonal-2.fbx`
        // ).then(processClip),

        //
        standing: await Joy.loadAsync(`/rpm/rpm-jog/standing.fbx`).then(
          ({ animations }) => {
            return mixer.clipAction(animations[0])
          }
        ),
        // jump: await Joy.loadAsync(`/rpm/rpm-jog/jump.fbx`).then(
        //   ({ animations }) => {
        //     return mixer.clipAction(animations[0])
        //   }
        // ),
      }

      sub.onLoop((dt) => {
        mixer.update(dt)
      })

      let avatarScene = avatarGLB.scene

      scene.add(avatarScene)
      sub.onClean(() => {
        scene.remove(avatarScene)
      })

      let last = () => {}

      let blendDuration = 0.2
      sub.onChange('action', (mode) => {
        last()

        let act = actions[mode]
        act?.reset().fadeIn(blendDuration).play()

        last = () => {
          act?.fadeOut(blendDuration)
        }
      })

      sub.now.action = 'standing'
      // sub.now.fbxMode = 'standing'

      let json = 0
      let et = 0

      let setAct = (v) => {
        if (sub.now.action !== v) {
          sub.now.action = v
        }
      }

      sub.onLoop((dt) => {
        et += dt
        player.getWorldPosition(avatarScene.position)
        player.getWorldQuaternion(avatarScene.quaternion)
        avatarScene.position.y -= 1.5

        // if (state.fwdPressed) {
        //   player.rotation.y = controls.getAzimuthalAngle()
        //   player.rotation.y += Math.PI
        // }
        // if (state.bkdPressed) {
        //   player.rotation.y = controls.getAzimuthalAngle()
        //   player.rotation.y += Math.PI
        // }

        // if (state.lftPressed) {
        //   player.rotation.y = controls.getAzimuthalAngle()
        //   player.rotation.y += Math.PI
        // }

        // if (state.rgtPressed) {
        //   player.rotation.y = controls.getAzimuthalAngle()
        //   player.rotation.y += Math.PI
        // }

        // avatarScene.visible = !params.firstPerson

        // if (
        //   state.fwdPressed ||
        //   state.bkdPressed ||
        //   state.lftPressed ||
        //   state.rgtPressed ||
        //   state.spacePressed ||
        //   state.frontMotion ||
        //   state.running
        // ) {
        //   if (state.spacePressed) {
        //     setAct('jump')
        //     // } else if (state.fwdPressed && state.lftPressed) {
        //     //   setAct("frontDiag2");
        //     // } else if (state.fwdPressed && state.rgtPressed) {
        //     //   setAct("frontDiag1");
        //     // } else if (state.bkdPressed && state.lftPressed) {
        //     //   setAct("backDiag2");
        //     // } else if (state.bkdPressed && state.rgtPressed) {
        //     //   setAct("backDiag1");
        //   } else if (state.fwdPressed || state.frontMotion) {
        //     setAct('front')
        //   } else if (state.bkdPressed) {
        //     setAct('back')
        //   } else if (state.lftPressed) {
        //     setAct('left')
        //   } else if (state.rgtPressed) {
        //     setAct('right')
        //   }

        //   // if (sub.now.fbxMode !== "running") {
        //   //   sub.now.fbxMode = "running";
        //   // }
        // } else if (!state.running) {
        //   setAct('standing')
        //   // if (sub.now.fbxMode !== "standing") {
        //   //   sub.now.action = "standing";
        //   //   sub.now.fbxMode = "standing";
        //   // }
        // }
      })

      sub.onLoop(() => {
        let avatarAct = Core.now.avatarAct

        // console.log(avatarAct)
        if (avatarAct === 'running') {
          setAct('front')
        } else {
          setAct(avatarAct)
        }
      })
      onDoneMyAvatar({ api, sub, avatarScene })

      return this
    }

    this.done = init()
  }
}

if (module.hot) {
  module.hot.dispose(() => {
    window.dispatchEvent(new CustomEvent('reload'))
  })
}
