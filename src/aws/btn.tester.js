import { removeS3, uploadS3 } from './aws.s3.gui'
import { onReady } from '@/vfx-cms/firebase'
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
                let firebase = await import('firebase-v8').then((e) => {
                  return e.default
                })

                //
                await onReady()
                let userIDTokenForUpload = await firebase
                  .auth()
                  .currentUser.getIdToken(/* forceRefresh */ true)
                  .then(function (idToken) {
                    // Send token to your backend via HTTPS
                    // ...

                    return idToken
                  })
                  .catch(function (error) {
                    // Handle error

                    return ''
                  })

                let result = await uploadS3({
                  file,
                  idToken: userIDTokenForUpload,
                  folderPath: 'tester-folder',
                })

                await onReady()
                let userIDTokenForRemoveObject = await firebase
                  .auth()
                  .currentUser.getIdToken(/* forceRefresh */ true)
                  .then(function (idToken) {
                    // Send token to your backend via HTTPS
                    // ...

                    return idToken
                  })
                  .catch(function (error) {
                    // Handle error

                    return ''
                  })

                console.log(result)
                let result2 = await removeS3({
                  idToken: userIDTokenForRemoveObject,
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
