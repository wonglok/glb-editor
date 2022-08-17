import { useAccessor } from '../store/use-accessor'
import { useENEditor } from '../store/use-en-editor'

export function GLBTreeNode({ node, getClass }) {
  let openEffectNode = useAccessor((s) => s.openEffectNode)
  let setOverlay = useENEditor((s) => s.setOverlay)

  return (
    <div className={`  ${getClass(node)}`}>
      <div
        className='flex justify-between'
        onClick={() => {
          //

          setOverlay(null)
          openEffectNode(node)
          setTimeout(() => {
            openEffectNode(node)
          })
        }}
      >
        <div className='text-xs text-white bg-lime-500'>{`${
          node.userData.effectNode?.nodes?.length > 0 ? '[EN]' : ''
        }`}</div>
        <div>{node.name}</div>
      </div>
      {node.children.map((it) => {
        return (
          <GLBTreeNode
            getClass={getClass}
            key={it.uuid}
            node={it}
          ></GLBTreeNode>
        )
      })}
    </div>
  )
}
