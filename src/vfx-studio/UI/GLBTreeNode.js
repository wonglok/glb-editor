export function GLBTreeNode({ node }) {
  return (
    <div className='w-full px-1 py-2 text-xs text-right bg-gray-300 border border-b border-gray-500 cursor-pointer hover:bg-gray-400'>
      {node.name}
      {node.children.map((it) => {
        return <GLBTreeNode key={it.uuid} node={it}></GLBTreeNode>
      })}
    </div>
  )
}
