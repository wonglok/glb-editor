import { useAccessor } from '@/vfx-studio/store/use-accessor'
import { GLSLEditor } from './GLSLEditor'

export function EditorColumnShader() {
  let layout = useAccessor((s) => s.layout)

  let [firstMesh] = useAccessor((s) => s.selectedMeshes)
  //
  //
  //
  return (
    <>
      {layout === 'shader' && (
        <div className='flex flex-col w-1/2 h-full'>
          <div
            className='flex items-center w-full bg-blue-200'
            style={{ height: '50px' }}
          >
            <button
              className='p-2 px-3 m-1 ml-2 bg-white'
              onClick={() => {
                //
              }}
            >
              vsHeader
            </button>
            {/*  */}
            {/*  */}
            <button
              className='p-2 px-3 m-1 bg-white'
              onClick={() => {
                //
              }}
            >
              vsPosition
            </button>
          </div>
          <div style={{ height: 'calc(100% - 50px)' }}>
            {firstMesh && (
              <GLSLEditor
                key={firstMesh.uuid}
                onSave={() => {}}
                onChange={() => {}}
                initValue={'aaa'}
                lang={'glsl'}
              ></GLSLEditor>
            )}
          </div>
        </div>
      )}
    </>
  )
}
