import { Canvas } from '@react-three/fiber'
import { EffectNodeEditor } from '@/vfx-studio/effectnode/Editor/EffectNodeEditor/EffectNodeEditor'
import { useAccessor } from '@/vfx-studio/store/use-accessor'

export function EditorColumnEffectNode() {
  let layout = useAccessor((s) => s.layout)
  let [firstMesh] = useAccessor((s) => s.selectedMeshes)
  //
  //
  //
  return (
    <>
      {layout === 'effectnode' && firstMesh && firstMesh.userData.effectNode && (
        <>
          <EffectNodeEditor></EffectNodeEditor>
        </>
      )}
    </>
  )
}

//
