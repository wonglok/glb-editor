import { useAccessor } from '@/vfx-studio/store/use-accessor'
import { Overlay } from '@/vfx-studio/UI/Overlay'
import { EditorColumnEffectNode } from '@/vfx-studio/UI/EditorColumnEffectNode'
import { DownloadButton } from './DownloadButton'
import { MeshMaterialEditor } from './MeshMaterialEditor'
import { BackButton } from './BackButton'
import { TitleButton } from './TitleButton'
import { RunnerEditor } from '@/vfx-studio/runner-editor/RunnerEditor'
// import { EffectNodeSeries } from './EffectNodeSeries'
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
        className='flex w-full h-full'
        style={{
          overflow: 'auto',
          width:
            layout === 'effectnode '
              ? `calc(100% - 280px)`
              : `calc(100% - 280px)`,
        }}
      >
        <div
          className={`
            relative
            h-full
            w-1/2
          `}
        >
          <RunnerEditor></RunnerEditor>
          <Overlay></Overlay>
        </div>

        {/*  */}
        {
          <div className='w-1/2 h-full bg-gray-100'>
            <EditorColumnEffectNode></EditorColumnEffectNode>
          </div>
        }
      </div>

      {/*  */}
      {/*  */}
      {/*  */}
      {/* <div className='h-full' style={{ width: `280px` }}> */}
      {/* <EffectNodeSeries></EffectNodeSeries> */}
      {/* <MeshMaterialEditor></MeshMaterialEditor> */}
      {/* </div> */}
    </div>
  )
}

//
