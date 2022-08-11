import { Core } from '@/vfx-core/Core'
import { UIContent } from '@/vfx-core/UIContent'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three140'
import { useMetaStore } from '../store/use-meta-store'

export function JoyStick() {
  let myCTX = useMetaStore((s) => s.myCTX)
  let setAction = useMetaStore((s) => s.setAction)
  let controls = useMetaStore((s) => s.controls)

  let ref = useRef()

  let doWork = useRef(() => {})
  useEffect(() => {
    if (!controls) {
      return
    }

    let clean = () => {}
    //leftjoystick
    import('nipplejs').then(async (nipplejs) => {
      let found = await new Promise((resolve) => {
        //

        let t1 = setInterval(() => {
          let found = ref.current
          if (found) {
            clearInterval(t1)
            resolve(found)
          }
        })

        //
      })
      let manager = nipplejs.create({
        zone: found,
        color: 'white',
      })
      clean()
      clean = () => {
        manager.destroy()
      }

      let up = new Vector3(0, 1, 0)
      let forward = new Vector3()
      let nippleAngle = 0
      let nippleForce = 0
      let active = 'off'

      manager
        .on('added', (evt, nipple) => {
          nipple.on('start move end dir plain', (evta, nipple) => {
            if (evta.type === 'move') {
              if (nipple?.angle?.radian) {
                active = 'on'

                //
                setAction('front', Infinity)

                nippleAngle = nipple.angle.radian + Math.PI * 1.5
                nippleForce = Math.abs(nipple.force)

                if (nippleForce >= 1) {
                  nippleForce = 1
                }
              }
            } else if (evta.type === 'end') {
              active = 'off'

              if (myCTX.avatarActionRepeat === Infinity) {
                setAction(myCTX.avatarActionResumeOnKeyUp, Infinity)
              }
            }
          })
        })
        .on('removed', (evt, nipple) => {
          nipple.off('start move end dir plain')
        })

      doWork.current = (dt) => {
        if (active === 'on' && controls) {
          // console.log(nippleAngle, controls.getAzimuthalAngle());

          forward.set(0, 0, -90.3 * dt)
          forward.applyAxisAngle(up, nippleAngle + controls.getAzimuthalAngle())

          forward.multiplyScalar(0.1)
          myCTX.player.position.add(forward)

          myCTX.player.rotation.y = nippleAngle + controls.getAzimuthalAngle()
        }
      }
    })

    return () => {
      clean()
    }
  }, [
    controls,
    myCTX.avatarActionRepeat,
    myCTX.avatarActionResumeOnKeyUp,
    myCTX.player.position,
    myCTX.player.rotation,
    setAction,
  ])

  //s
  useFrame((st, dt) => {
    doWork?.current(dt)
  })
  return (
    <UIContent>
      <div
        // onPointerDown={() => {
        //   goFowradDown()
        // }}
        // onPointerUp={() => {
        //   goFowradUp()
        // }}

        //

        ref={ref}
        style={{ zIndex: 100 }}
        className='fixed block w-32 h-32 p-2 bg-white rounded-full bg-opacity-30 backdrop-blur-2xl bottom-3 left-3'
      >
        {/*  */}
      </div>
    </UIContent>
  )
}
