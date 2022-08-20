import { useENEditor } from '@/vfx-studio/store/use-en-editor'
import { EffectNodeObject } from '../EffectNodeObject/EffectNodeObject'

export function ENRunNode({ glbObject, node, disabledNodes, isEditingMode }) {
  let reloadGraphID = useENEditor((s) => s.reloadGraphID)

  return (
    <>
      {node.userData?.effectNode && (
        <EffectNodeObject
          key={node.uuid + reloadGraphID}
          glbObject={glbObject}
          item={node}
          disabledNodes={disabledNodes}
          effectNode={node.userData.effectNode}
          isEditingMode={isEditingMode}
        ></EffectNodeObject>
      )}

      {/*  */}
      {node.children.map((it) => {
        return <ENRunNode key={it.uuid} node={it}></ENRunNode>
      })}
    </>
  )
}
