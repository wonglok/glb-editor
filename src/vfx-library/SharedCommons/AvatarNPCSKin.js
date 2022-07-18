import { Mesh } from 'three'
import { MeshBasicMaterial } from 'three'
import { AnimationMixer, BoxBufferGeometry, Object3D } from 'three'
import { Joy, loadGLTF } from './AvatarSkin'

export class AvatarNPCSKin {
  constructor({ scene, chaser, avatarURL }) {
    let npc = new Object3D()
    this.o3d = npc
    scene.add(npc)

    this.clean = () => {
      scene.remove(npc)
    }

    chaser.sub.onLoop(() => {
      if (chaser.sub.now.running) {
        npc.position.y = chaser.player.position.y
        npc.position.lerp(chaser.player.position, 0.9)
        npc.lookAt(chaser.player.position)
        npc.position.y -= 2
      } else {
        npc.position.y = chaser.player.position.y
        npc.position.lerp(chaser.player.position, 0.1)
        npc.lookAt(chaser.player.position)
        npc.position.y -= 2
      }

      if (chaser.player.userData.first) {
        chaser.player.userData.first = false
        npc.position.copy(chaser.chaseTarget.position)
        npc.position.y -= 1.5
      }
    })

    // console.log("AvatarNPCSKin", avatarURL);
    loadGLTF(`${avatarURL}`).then(async (glb) => {
      npc.add(glb.scene)
      chaser.player.visible = false

      glb.scene.traverse((it) => {
        it.frustumCulled = false
      })

      let mixer = new AnimationMixer(glb.scene)
      chaser.sub.onLoop((dt) => {
        mixer.update(dt)
      })

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

      let actions = {
        front: await Joy.loadAsync(`/rpm/rpm-jog/jog-forward.fbx`).then(
          processClip
        ),

        standing: await Joy.loadAsync(`/rpm/rpm-jog/standing.fbx`).then(
          ({ animations }) => {
            return mixer.clipAction(animations[0])
          }
        ),
      }

      let last = () => {}
      let blendDuration = 0.3
      let switcher = (mode) => {
        if (mode === 'running') {
          last()

          let act = actions['front']
          act?.reset().fadeIn(blendDuration).play()

          last = () => {
            act?.fadeOut(blendDuration)
          }
        } else if (mode === 'standing') {
          last()

          let act = actions['standing']
          act?.reset().fadeIn(blendDuration).play()

          last = () => {
            act?.fadeOut(blendDuration)
          }
        }
      }

      let lastMode = ''
      chaser.sub.onChange('running', (isRunning) => {
        if (isRunning) {
          if (lastMode !== 'running') {
            lastMode = 'running'

            switcher(lastMode)
          }
        } else {
          if (lastMode !== 'standing') {
            lastMode = 'standing'

            switcher(lastMode)
          }
        }
      })
    })

    // console.log(walker, avatarURL);
  }
}

export { Joy }
