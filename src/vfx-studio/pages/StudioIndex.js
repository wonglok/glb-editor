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
      <div className='p-2'>
        <h1 className='text-2xl font-bold'>Decenralisted GLB Editor</h1>
        <div>Please Pick a GLB File to Edit.</div>
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
              let { fileID } = await writeGLB({
                name: name + '-' + new Date().getTime(),
                buffer,
              })

              Core.now.reloadFileList = getID()

              router.push(`/${Slug}/${fileID}`)
            }}
          ></TryMe>
        </div>

        <MyFiles
          onOpen={(file) => {
            router.push(`/${Slug}/${file.fileID}`)
          }}
        ></MyFiles>

        {/*  */}
      </div>

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

//
