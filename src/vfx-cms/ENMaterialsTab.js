import { useMemo, useState } from 'react'
import { getID } from '@/vfx-runtime/ENUtils'
import { ENMethods, ENState } from './ENState'

export function ENMaterialsTab() {
  ENState.makeKeyReactive('currentEditNodeID')
  ENState.makeKeyReactive('currentEditNodeID')
  let fireNodeID = ENState.currentEditNodeID
  let node = useMemo(() => {
    let node = ENState.nodes.find((e) => e._fid === fireNodeID)

    return node
  }, [fireNodeID])
  node.data.materials = node.data.materials || []

  let [, reload] = useState(0)
  //

  //
  return (
    <div>
      <div>
        <button
          onClick={() => {
            //

            node.data.materials.push({
              _id: getID(),
              name: 'speed',
              type: 'physical',
              nodeID: node.data._id,
              //
            })

            ENMethods.saveCodeBlock({ node }).then(() => {
              reload((s) => s + 1)
            })
          }}
        >
          Button
        </button>
      </div>

      {node.data.materials.map((mm) => {
        return <div key={mm._id}>{JSON.stringify(mm)}</div>
      })}
      <div>123</div>
    </div>
  )
}
