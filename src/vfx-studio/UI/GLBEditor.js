import { useAccessor } from '@/vfx-studio/store/use-accessor'
import { Overlay } from '@/vfx-studio/UI/Overlay'
import { EditorColumnEffectNode } from '@/vfx-studio/UI/EditorColumnEffectNode'
import { DownloadButton } from './DownloadButton'
import { MeshMaterialEditor } from './MeshMaterialEditor'
import { BackButton } from './BackButton'
import { TitleButton } from './TitleButton'
import { RunnerEditor } from '@/vfx-studio/runner-editor/RunnerEditor'
import { EffectNodeSeries } from './EffectNodeSeries'
import { GLBTree } from './GLBTree'

export function GLBEditor() {
  let layout = useAccessor((s) => s.layout)

  return (
    <div className='flex items-start justify-between w-full h-full'>
      <div className='h-full' style={{ width: `280px` }}>
        <BackButton></BackButton>
        <TitleButton></TitleButton>
        <DownloadButton></DownloadButton>
        <GLBTree></GLBTree>
      </div>
      <div
        className='flex h-full'
        style={{ width: `calc(100% - 280px - 280px)` }}
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
        <div className='w-2/3 h-full'>
          <EditorColumnEffectNode></EditorColumnEffectNode>
        </div>
      </div>
      <div className='h-full' style={{ width: `280px` }}>
        {/* <EffectNodeSeries></EffectNodeSeries> */}
        <MeshMaterialEditor></MeshMaterialEditor>
      </div>
    </div>
  )
}
