import { useENEditor } from '@/vfx-studio/store/use-en-editor'
import { useFilterEffectNode } from '@/vfx-studio/store/use-filter-effectnode'
import { EffectNodeObject } from '../EffectNodeObject/EffectNodeObject'

export function EffectNodeRuntime({ glbObject }) {
  let reloadGraphID = useENEditor((s) => s.reloadGraphID)
  let ens = useFilterEffectNode({ glbObject })
  glbObject.scene.updateMatrixWorld(true)

  return (
    <>
      <group key={reloadGraphID}>
        {glbObject &&
          ens.length > 0 &&
          ens.map((en) => {
            en.updateMatrixWorld()
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
