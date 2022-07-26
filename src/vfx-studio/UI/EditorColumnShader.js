import { useAccessor } from 'vfx-studio/store/use-accessor'
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
        <div className='w-1/2 h-full flex flex-col'>
          <div
            className='w-full bg-blue-200 flex items-center'
            style={{ height: '50px' }}
          >
            <button
              className='m-1 ml-2 p-2 px-3 bg-white'
              onClick={() => {
                //
              }}
            >
              vsHeader
            </button>
            {/*  */}
            {/*  */}
            <button
              className='m-1 p-2 px-3 bg-white'
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
