import { removeS3, uploadS3 } from './aws.s3.gui'

export default function S3BtnTester() {
  return (
    <div>
      <button
        onClick={() => {
          let input = document.createElement('input')
          input.type = 'file'
          input.onchange = async ({ target: { files } }) => {
            let file = files[0]
            console.log(files)

            if (file) {
              try {
                let result = await uploadS3({
                  file,
                  folderPath: 'tester-folder',
                })
                console.log(result)
                let result2 = await removeS3({
                  fileS3: result.fileInfo,
                })
                console.log(result2)
                //
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
    </div>
  )
}
