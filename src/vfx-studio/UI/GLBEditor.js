import { useAccessor } from '@/vfx-studio/store/use-accessor'
import { Overlay } from '@/vfx-studio/UI/Overlay'
import { EditorColumnEffectNode } from '@/vfx-studio/UI/EditorColumnEffectNode'
import { DownloadButton } from './DownloadButton'
import { MeshMaterialEditor } from './MeshMaterialEditor'
import { BackButton } from './BackButton'
import { TitleButton } from './TitleButton'
import { RunnerEditor } from '@/vfx-studio/runner-editor/RunnerEditor'

export function GLBEditor() {
  let layout = useAccessor((s) => s.layout)
  return (
    <div className='flex items-start justify-between w-full h-full'>
      <div className='h-full' style={{ width: `300px` }}>
        <BackButton></BackButton>
        <TitleButton></TitleButton>
        <DownloadButton></DownloadButton>
      </div>
      <div
        className='flex h-full'
        style={{ width: `calc(100% - 300px - 300px)` }}
      >
        <div
          className={`
            h-full
            relative
            ${layout === 'full' && 'w-full'}
            ${layout === 'effectnode' && 'w-1/2'}
          `}
        >
          <RunnerEditor></RunnerEditor>
          <Overlay></Overlay>
        </div>
        <EditorColumnEffectNode></EditorColumnEffectNode>
      </div>
      <div className='h-full' style={{ width: `300px` }}>
        <MeshMaterialEditor></MeshMaterialEditor>
      </div>
    </div>
  )
}
