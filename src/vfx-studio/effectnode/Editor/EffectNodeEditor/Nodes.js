import { Box, Select } from '@react-three/drei'
import { ErrorBoundary } from '@react-three/fiber'
import { useENEditor } from 'vfx-studio/store/use-en-editor'
import { NodeSingle } from './NodeSingle'

export function Nodes() {
  let effectNodeID = useENEditor((s) => s.effectNodeID)
  let effectNodeMap = useENEditor((s) => s.effectNodeMap)

  let effectNode = effectNodeMap?.get(effectNodeID)
  return (
    <group>
      {effectNode && (
        <>
          {effectNode?.nodes
            ?.filter((e) => e)
            .map((nd) => {
              return (
                <NodeSingle
                  key={nd?._id}
                  node={nd}
                  graph={effectNode}
                ></NodeSingle>
              )
            })}

          {/*  */}
        </>
      )}
      {/*  */}
      {/*  */}
      {/*  */}
    </group>
  )
}
