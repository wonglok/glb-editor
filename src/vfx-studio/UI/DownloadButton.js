import { useAccessor } from 'vfx-studio/store/use-accessor'
import { Exporter } from 'vfx-studio/store/use-exporter'

export function DownloadButton() {
  let glb = useAccessor((s) => s.glbObject)
  let fileID = useAccessor((s) => s.fileID)
  let updateGLBBinary = useAccessor((s) => s.updateGLBBinary)
  let glbMetadata = useAccessor((s) => s.glbMetadata)
  return (
    <div>
      <button
        className='block w-full text-xs text-center py-2 bg-gray-100'
        onClick={(ev) => {
          ev.target.innerText = 'Optimising, Saving....'
          Exporter.download({
            group: glb.scene,
            clips: glb.animations || [],
            downloadName: glbMetadata.name,
            onDoneOptimizeBuffer: async (buffer) => {
              console.log(fileID, buffer)
              //
              await updateGLBBinary({ fileID, buffer })
              ev.target.innerText = 'Save'
            },
          })
        }}
      >
        Save
      </button>
      {/*  */}
      {/*  */}
      <button
        className='block w-full text-xs text-center py-2 bg-gray-200'
        onClick={(ev) => {
          ev.target.innerText = 'Optimising, Exporting....'
          Exporter.download({
            group: glb.scene,
            clips: glb.animations || [],
            downloadName: glbMetadata.name,
          }).then(() => {
            ev.target.innerText = 'Export'
          })
        }}
      >
        Export
      </button>
    </div>
  )
}

//
