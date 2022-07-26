import { useENEditor } from 'vfx-studio/store/use-en-editor'
import { SingleWire } from './SingleWire'

export function ConnectedWires() {
  let getEffectNode = useENEditor((s) => s.getEffectNode)
  let effectNode = getEffectNode()
  return (
    <group>
      {effectNode && (
        <>
          {effectNode.connections.map((link) => {
            return <SingleWire key={link._id} link={link}></SingleWire>
          })}
        </>
      )}
      {/*  */}

      {/* <SingleWire link={}></SingleWire> */}
      {/*  */}
    </group>
  )
}
