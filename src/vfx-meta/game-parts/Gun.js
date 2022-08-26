import create from 'zustand'
import { UIContent } from '@/vfx-core/UIContent'
import { BoxBufferGeometry, Vector3 } from 'three'
import { Mesh, MeshBasicMaterial, Object3D } from 'three140'
import { getID } from '@/vfx-runtime/ENUtils'
import amim from 'animejs'

class OneMissle extends Object3D {
  constructor() {
    super()

    this._id = getID()
    this.tFrom = new Vector3()
    this.tAim = new Vector3()

    let ball = new Mesh(
      new BoxBufferGeometry(3, 3, 3),
      new MeshBasicMaterial({ color: 0xff0000 })
    )
    this.add(ball)

    this.visible = false
    this.play = () => {
      this.visible = true
      ball.scale.setScalar(1)
      ball.position.copy(this.tFrom)

      amim({
        targets: [ball.position],
        x: this.tAim.x,
        y: this.tAim.y,
        z: this.tAim.z,
        complete: () => {
          amim({
            targets: [ball.scale],
            x: 0,
            y: 0,
            z: 0,
            complete: () => {
              this.visible = false
            },
          })
        },
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
  return (
    <UIContent>
      <div className='fixed bottom-0 right-0 p-2'>
        <div
          onClick={() => {
            //
            sendFire()
          }}
          className='flex items-center justify-center w-32 h-32 text-2xl bg-yellow-500 rounded-full bg-opacity-50'
        ></div>
      </div>
    </UIContent>
  )
}
