import { removeS3, uploadS3 } from './aws.s3.gui'
import { onReady } from '@/vfx-cms/firebase'
import { useMetaStore } from '@/vfx-meta/store/use-meta-store'
export default function S3BtnTester() {
  return (
    <div>
      {
        <button
          onClick={() => {
            let input = document.createElement('input')
            input.type = 'file'
            input.onchange = async ({ target: { files } }) => {
              let file = files[0]
              console.log(files)

              if (file) {
                try {
                  //
                  let result = await uploadS3({
                    file,
                    idToken: '',
                    folderPath: 'tester-folder',
                  })

                  //
                  let result2 = await removeS3({
                    idToken: '',
                    fileS3: result.fileInfo,
                  })

                  console.log(result2)
                  //
                } catch (e) {
                  console.log(e)
                }
              }
            }

            input.click()
          }}
        >
          upload
        </button>
      }
    </div>
  )
}
