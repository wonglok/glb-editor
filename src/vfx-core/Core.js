import { Object3D } from 'three'
import { TJCore } from './TJCore'

export const Core = new TJCore({ name: 'thank you jesus' })
Core.now.goToPlace = new Object3D()
Core.now.goToPlace.visible = false
Core.now.avatarAct = 'standing'
