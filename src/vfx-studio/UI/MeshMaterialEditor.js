import { useEffect, useRef } from 'react'
import {
  BackSide,
  DoubleSide,
  FrontSide,
  MeshPhysicalMaterial,
  // MeshPhysicalMaterial,
  // MeshStandardMaterial,
} from 'three'
import { Color } from 'three140'
import { useAccessor } from '@/vfx-studio/store/use-accessor'

export function MeshMaterialEditor() {
  let selectedMeshes = useAccessor((s) => s.selectedMeshes) || []
  let [first] = selectedMeshes

  return first ? (
    <>
      <Details mesh={first}></Details>
    </>
  ) : null
}

//
function Details({ mesh }) {
  let refDiv = useRef()
  let removeEffectNode = useAccessor((s) => s.removeEffectNode) || []
  let openEffectNode = useAccessor((s) => s.openEffectNode) || []

  let setLayout = useAccessor((s) => s.setLayout)
  useEffect(() => {
    setLayout('full')
  }, [mesh])

  //
  useEffect(() => {
    let clean = () => {}
    import('tweakpane').then(({ Pane }) => {
      let pane = new Pane({ container: refDiv.current })

      if (mesh?.material) {
        let currentMat = mesh.material

        mesh.userData.beforeMat = mesh.userData.beforeMat || currentMat.clone()

        // mesh.userData.beforeAfter = mesh.userData.beforeAfter || 'before'
        // pane
        //   .addInput(mesh.userData, 'beforeAfter', {
        //     options: {
        //       beforeMat: 'before',
        //       afterMat: 'after',
        //     },
        //   })
        //   .on('change', ({ value }) => {
        //     if (value === 'before') {
        //       mesh.material = mesh.userData.beforeMat
        //     } else if (value === 'after') {
        //       mesh.material = mesh.userData.newMat
        //     }
        //   })
        // //

        pane.addInput(currentMat, 'metalness', {
          min: 0,
          max: 1,
        })

        pane.addInput(currentMat, 'roughness', {
          min: 0,
          max: 1,
        })

        pane.addInput(currentMat, 'side', {
          options: {
            double: DoubleSide,
            front: FrontSide,
            back: BackSide,
          },
        })

        pane.addInput(currentMat, 'transparent')

        pane.addInput(currentMat, 'opacity', {
          min: 0,
          max: 1,
        })

        let addColorPicker = (name) => {
          let PARAMS = {
            [name]:
              '#' + new Color(currentMat[name] || 0xffffff).getHexString(),
            _____outbound: new Color(currentMat[name] || 0xffffff),
          }
          pane
            .addInput(PARAMS, name, {
              view: 'color',
              color: { alpha: false },
            })
            .on('change', (ev) => {
              PARAMS[name] = ev.value
              PARAMS._____outbound.set(ev.value)
              currentMat[name] = PARAMS._____outbound
            })
        }

        addColorPicker('color')
        addColorPicker('emissive')

        const btnEffectNode = pane.addButton({
          title: 'Launch Effect Node',
          label: 'Tool', // optional
        })

        btnEffectNode.on('click', () => {
          openEffectNode(mesh)
        })

        const btnGLSLClose = pane.addButton({
          title: 'Close', // optional
          label: 'Tool',
        })
        btnGLSLClose.on('click', () => {
          setLayout('full')
        })

        const btnEffectNodeRemove = pane.addButton({
          title: 'Remove Effect Node',
          label: 'Tool', // optional
        })

        btnEffectNodeRemove.on('click', () => {
          if (window.confirm('remove and reset this effect node?')) {
            // mesh.userData.effectNode = {
            //   nodes: [],
            //   connections: [],
            // }
            // setLayout('full')
            removeEffectNode(mesh)
          }
        })
        //
      }

      clean()
      clean = () => {
        pane.dispose()
      }
    })
    return () => {
      clean()
    }
  }, [mesh])
  //
  //
  //
  return (
    <div className='bg-white'>
      <div className='py-2 text-xs text-center bg-green-300'>{mesh.name}</div>
      <div className='p-2'>
        <div ref={refDiv}></div>
      </div>
    </div>
  )
}

//
