import { Core } from '@/vfx-core/Core'
import { Object3D } from 'three'
import { AvatarNPCSKin } from './AvatarNPCSKin'
import { Chaser } from './Chaser'

export class Companion extends Object3D {
  constructor({ parent, api, chase }) {
    super()
    let destination = chase || parent.player || new Object3D()

    let chaser = new Chaser({
      name: 'Chaser Core',
      chaseTarget: destination,
      api,
      visible: true,
      speedFactor: 1,
      Settings: parent.params,
      collider: parent.collider,
      scene: parent.o3d,
      chaseDistance: 2,
    })

    this.clean = () => {
      //
      chaser.sub.clean()
    }

    let cleanUser = () => {}
    let lastURL = ''

    chaser.sub.onClean(() => {
      cleanUser()
    })

    //

    let displayAvatar = (url) => {
      if (lastURL !== url) {
        lastURL = url
        cleanUser()
        let avatar = new AvatarNPCSKin({
          scene: parent.o3d,
          chaser,
          avatarURL: url,
        })

        cleanUser = () => {
          avatar.clean()
        }
      }
    }

    displayAvatar(`/Metaverse/avatar/angel.glb`)
  }

  //
}
