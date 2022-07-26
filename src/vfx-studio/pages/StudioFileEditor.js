import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAccessor } from '@/vfx-studio/store/use-accessor'
import { FileGuard } from '@/vfx-studio/UI/FileGuard'
import { GLBEditor } from '@/vfx-studio/UI/GLBEditor'

export default function StudioFileEditor() {
  let {
    query: { fileID },
    pathname,
  } = useRouter()
  let loadBfferGLB = useAccessor((s) => s.loadBfferGLB)

  useEffect(() => {
    //
    if (fileID) {
      loadBfferGLB(fileID)

      if (process.env.NODE_ENV === 'production') {
        window.onbeforeunload = () => {
          return 'Do you need to save files?'
        }

        return () => {
          window.onbeforeunload = undefined
        }
      }
    }

    return () => {}
  }, [fileID, pathname])

  return (
    <>
      <FileGuard fileID={fileID}>
        <GLBEditor></GLBEditor>
      </FileGuard>
    </>
  )
}

//

//

//

//

//
