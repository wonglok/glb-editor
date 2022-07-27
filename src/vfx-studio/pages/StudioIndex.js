import { Core } from '@/vfx-core/Core'
import { useRouter } from 'next/router'
import { getID } from '@/vfx-runtime/ENUtils'

import { Slug } from '@/vfx-studio/shared/slug'
import { writeGLB } from '@/vfx-studio/shared/storage'
import { FileInput } from '@/vfx-studio/UI/FileInput'
import { MyFiles } from '@/vfx-studio/UI/MyFiles'
import { TryMe } from '../UI/TryMe'

export default function StudioHome() {
  let router = useRouter()
  return (
    <div>
      <div>Please Select GLB File</div>
      <div>
        <FileInput
          onFile={async ({ buffer, file, name }) => {
            // file
            // console.log(file)
            writeGLB({ name, buffer })
            Core.now.reloadFileList = getID()
          }}
        ></FileInput>

        <TryMe
          onFile={async ({ buffer, file, name }) => {
            // file
            // console.log(file)
            writeGLB({ name, buffer })
            Core.now.reloadFileList = getID()
          }}
        ></TryMe>
      </div>

      <MyFiles
        onOpen={(file) => {
          router.push(`/${Slug}/${file.fileID}`)
        }}
      ></MyFiles>

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
    </div>
  )
}

//

//

//

//

//
