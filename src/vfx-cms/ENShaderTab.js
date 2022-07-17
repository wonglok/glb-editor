import { useMemo } from 'react'
import { ENState } from './ENState'

export function ENShaderTab() {
  ENState.makeKeyReactive('currentEditNodeID')
  let fireNodeID = ENState.currentEditNodeID
  let node = useMemo(() => {
    let node = ENState.nodes.find((e) => e._fid === fireNodeID)

    return node
  }, [fireNodeID])
  node.data.shaders = node.data.shaders || []
  // console.log(node)

  return (
    <div>
      <div>
        {node.data.shaders.forEach((it) => {
          //
          return it
        })}
      </div>
      <div>123 123 123</div>
      <div>123 123 123</div>
    </div>
  )
}
