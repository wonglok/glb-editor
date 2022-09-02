import { useAccessor } from '../store/use-accessor'
import { useENEditor } from '../store/use-en-editor'

export function GLBTreeNode({ isSelected = false, node, getClass }) {
  let openEffectNode = useAccessor((s) => s.openEffectNode)
  let setOverlay = useENEditor((s) => s.setOverlay)
  let selectedMeshes = useAccessor((s) => s.selectedMeshes)

  return (
    <div
      className={`   cursor-pointer border-l w-full pl-1 text-xs text-${getClass(
        node,
        true,
        '500'
      )} `}
    >
      <div
        className={
          'flex justify-between border border-transparent hover:border-black ' +
          (isSelected
            ? ` p-2 text-${getClass(node, true, '500').trim()}  bg-${getClass(
                node,
                true,
                '200'
              ).trim()}`
            : 'bg-white')
        }
        onClick={() => {
          //

          setOverlay(null)
          openEffectNode(node)
          setTimeout(() => {
            openEffectNode(node)
          })
        }}
      >
        <div>
          {isSelected ? '→ ' : ' '} {node.name}
        </div>
        <div
          className={
            'text-xs text-white pl-1 ' +
            (node.userData.effectNode?.nodes?.length > 0 ? 'pr-1' : '')
          }
        >{`${node.userData.effectNode?.nodes?.length > 0 ? '✳️' : ''}`}</div>
      </div>
      {node.children.map((it) => {
        return (
          <GLBTreeNode
            getClass={getClass}
            key={it.uuid}
            node={it}
            isSelected={selectedMeshes[0] && selectedMeshes[0].uuid === it.uuid}
          ></GLBTreeNode>
        )
      })}
    </div>
  )
}
