import { useAccessor } from '../store/use-accessor'

export function GLBTreeNode({ node, getClass }) {
  let openEffectNode = useAccessor((s) => s.openEffectNode)

  return (
    <div className={`  ${getClass(node)}`}>
      <div
        className='flex justify-between'
        onClick={() => {
          //
          openEffectNode(node)
        }}
      >
        <div className=' text-white bg-lime-500'>{`${
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
