import create from 'zustand'
import { UIContent } from '@/vfx-core/UIContent'
import { BoxBufferGeometry, SphereBufferGeometry, Vector3 } from 'three'
import {
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Object3D,
} from 'three140'
import { getID } from '@/vfx-runtime/ENUtils'
import amim from 'animejs'
import { useMetaStore } from '../store/use-meta-store'

class OneMissle extends Object3D {
  constructor() {
    super()

    this._id = getID()
    this.tFrom = new Vector3()
    this.tAim = new Vector3()

    let ball = new Mesh(
      new SphereBufferGeometry(3, 32, 32),
      new MeshPhysicalMaterial({
        color: 0xff0000,
        roughness: 0,
        transmission: 1,
        ior: 1.2,
        thickness: 1,
        transparent: true,
      })
    )
    this.add(ball)

    this.visible = false
    this.play = () => {
      this.visible = true
      ball.scale.setScalar(0.5)
      ball.position.copy(this.tFrom)

      amim({
        targets: [ball.scale],
        x: 1,
        y: 1,
        z: 1,
        duration: 3000,

        complete: () => {
          this.visible = false
        },
      })

      amim({
        targets: [ball.position],
        x: this.tAim.x,
        y: this.tAim.y,
        z: this.tAim.z,
        duration: 3000,
        complete: () => {},
      })
    }

    // /
  }
}

export const useGun = create((set, get) => {
  let missles = []

  for (let i = 0; i < 500; i++) {
    let aMissle = new OneMissle()
    missles.push(aMissle)
  }
  return {
    to: new Vector3(),
    from: new Vector3(),
    missles,

    cursor: 0,

    sendFire: () => {
      ///

      let old = get().cursor
      //
      let latestCursor = old + 1
      latestCursor = latestCursor % missles.length
      set({ cursor: latestCursor })

      let aMissle = get().missles[latestCursor]

      //
      get().from.z += -11
      aMissle.tFrom.copy(get().from)
      aMissle.tAim.copy(get().to)
      aMissle.play()

      //
      ///
    },
    //
  }
})

export function Gun() {
  let missles = useGun((s) => s.missles)
  return (
    <group>
      {missles.map((m) => {
        return (
          <group key={m._id}>
            <primitive object={m}></primitive>
          </group>
        )
      })}
    </group>
  )
}

export function GunUI() {
  let sendFire = useGun((s) => s.sendFire)
  let myCTX = useMetaStore((s) => s.myCTX)

  let t = 0
  return (
    <UIContent>
      <div className='fixed bottom-0 right-0 p-2 select-none'>
        <div
          onPointerDown={() => {
            //
            clearInterval(t)
            t = setInterval(() => {
              sendFire({ player: myCTX.player })
            }, 30)
          }}
          onPointerUp={() => {
            clearInterval(t)
          }}
          className='flex items-center justify-center w-32 h-32 text-2xl bg-yellow-500 rounded-full select-none bg-opacity-50'
        ></div>
      </div>
    </UIContent>
  )
}
