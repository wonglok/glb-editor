import { getPosMD5 } from '@/vfx-studio/store/use-accessor'
import { useENEditor } from '@/vfx-studio/store/use-en-editor'
import { useFilterEffectNode } from '@/vfx-studio/store/use-filter-effectnode'
import md5 from 'md5'
import { Suspense, useEffect, useState } from 'react'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'
import { EffectNodeObject } from '../EffectNodeObject/EffectNodeObject'
import { ENRunNode } from './ENRunNode'

export function EffectNodeRuntime({
  glbObject,
  originalGLBObject,
  disabledNodes = ['effect-composer', '.pass.', 'global.'],
  isEditingMode = false,
}) {
  let reloadGraphID = useENEditor((s) => s.reloadGraphID)
  // let ens = useFilterEffectNode({ glbObject })
  glbObject.scene.updateMatrixWorld(true)

  // let [ready, setReady] = useState(false)
  useEffect(() => {
    // setReady(false)

    getPosMD5(glbObject)
    if (originalGLBObject) {
      getPosMD5(originalGLBObject)
    }
  }, [glbObject, originalGLBObject, reloadGraphID])

  //
  return (
    <>
      <Suspense fallback={null}>
        <ENRunNode
          key={reloadGraphID}
          disabledNodes={disabledNodes}
          node={glbObject.scene}
          glbObject={glbObject}
          isEditingMode={isEditingMode}
        ></ENRunNode>
      </Suspense>

      {/* <EffectNodeObject></EffectNodeObject> */}
      {/* <group>
        {ready &&
          glbObject &&
          ens.length > 0 &&
          ens.map((en) => {
            return (
              <EffectNodeObject
                key={en.uuid + reloadGraphID + glbObject.uuid}
                glbObject={glbObject}
                item={en}
                disabledNodes={disabledNodes}
                effectNode={en.userData.effectNode}
              ></EffectNodeObject>
            )
          })}
      </group> */}
    </>
  )
}

//
