import { useAccessor } from '@/vfx-studio/store/use-accessor'
import { useENEditor } from '@/vfx-studio/store/use-en-editor'
import { SingleWire } from './SingleWire'

export function ConnectedWires() {
  let getEffectNode = useENEditor((s) => s.getEffectNode)
  let effectNode = getEffectNode()
  let reloadGraphID = useENEditor((s) => s.reloadGraphID)
  let selectedMeshes = useAccessor((s) => s.selectedMeshes)

  //
  // effectNode.connections.map((e) => e._id)
  //

  // console.log(effectNode)

  return (
    <group>
      {effectNode && (
        <>
          {effectNode.connections.map((link) => {
            return (
              <SingleWire
                key={
                  link._id +
                  reloadGraphID +
                  selectedMeshes.map((e) => e.uuid) +
                  effectNode.connections.map((e) => e._id).join('_') +
                  effectNode.nodes.map((e) => e._id).join('_')
                }
                link={link}
              ></SingleWire>
            )
          })}
        </>
      )}

      {/*  */}

      {/* <SingleWire link={}></SingleWire> */}
      {/*  */}
    </group>
  )
}
