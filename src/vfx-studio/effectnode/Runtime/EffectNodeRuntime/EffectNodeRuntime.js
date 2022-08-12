import { useENEditor } from '@/vfx-studio/store/use-en-editor'
import { useFilterEffectNode } from '@/vfx-studio/store/use-filter-effectnode'
import { useEffect, useState } from 'react'
import { EffectNodeObject } from '../EffectNodeObject/EffectNodeObject'

export function EffectNodeRuntime({ glbObject, originalGLBObject }) {
  let reloadGraphID = useENEditor((s) => s.reloadGraphID)
  let ens = useFilterEffectNode({ glbObject })
  glbObject.scene.updateMatrixWorld(true)

  let [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(false)
    ens.forEach((en) => {
      //
      en.updateMatrixWorld()

      //

      if (en.userData.effectNode) {
        if (originalGLBObject) {
          originalGLBObject.scene.traverse((oo) => {
            if (oo.userData.posMD5 === en.userData.posMD5) {
              en.material = oo.material.clone()
              en.material.needsUpdate = true
            }
          })
        }
      }
    })
    setTimeout(() => {
      setReady(true)
    })
  }, [ens, originalGLBObject, reloadGraphID, glbObject])
  return (
    <>
      <group>
        {ready &&
          glbObject &&
          ens.length > 0 &&
          ens.map((en) => {
            return (
              <EffectNodeObject
                key={en.uuid + reloadGraphID}
                glbObject={glbObject}
                item={en}
                effectNode={en.userData.effectNode}
              ></EffectNodeObject>
            )
          })}
      </group>
    </>
  )
}
