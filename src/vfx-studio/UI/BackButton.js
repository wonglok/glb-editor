import { useRouter } from 'next/router'
import { Slug } from 'vfx-studio/shared/slug'
import { useAccessor } from 'vfx-studio/store/use-accessor'
import { Exporter } from 'vfx-studio/store/use-exporter'

export function BackButton() {
  let router = useRouter()

  let glb = useAccessor((s) => s.glbObject)
  let fileID = useAccessor((s) => s.fileID)
  let updateGLBBinary = useAccessor((s) => s.updateGLBBinary)
  let glbMetadata = useAccessor((s) => s.glbMetadata)
  return (
    <div>
      <button
        className='block w-full text-center py-2 text-xs bg-gray-200'
        onClick={(ev) => {
          //
          //
          ev.target.innerText = 'Optimising, Saving....'
          Exporter.download({
            group: glb.scene,
            clips: glb.animations || [],
            downloadName: glbMetadata.name,
            onDoneOptimizeBuffer: async (buffer) => {
              console.log(fileID, buffer)

              //
              //
              await updateGLBBinary({ fileID, buffer })
              ev.target.innerText = 'Save & Back to Menu'

              router.push(`/${Slug}`)
            },
          })
        }}
      >
        Save & Back to Menu
      </button>
    </div>
  )
}
