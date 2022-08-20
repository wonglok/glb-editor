import { useAccessor } from '@/vfx-studio/store/use-accessor'

export function TitleButton() {
  let glbMetadata = useAccessor((s) => s.glbMetadata)
  let renameGLB = useAccessor((s) => s.renameGLB)

  // {glbMetadata.name}

  return (
    <div>
      {glbMetadata && (
        <textarea
          className='block w-full p-2 text-xs text-center text-white bg-blue-500'
          rows={1}
          key={glbMetadata.fileID}
          defaultValue={glbMetadata.name}
          disabled
          onChange={(ev) => {
            //

            renameGLB({
              fileID: glbMetadata.fileID,
              name: (ev.target.value || '').trim(),
            })

            //
          }}
        ></textarea>
      )}
    </div>
  )
}
