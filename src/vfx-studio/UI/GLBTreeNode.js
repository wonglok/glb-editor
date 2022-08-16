import { useAccessor } from '../store/use-accessor'

export function GLBTreeNode({ node, getClass }) {
  let openEffectNode = useAccessor((s) => s.openEffectNode)

  return (
    <div className={`  ${getClass(node)}`}>
      <div
        onClick={() => {
          //
          openEffectNode(node)
        }}
      >
        {node.name}
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
