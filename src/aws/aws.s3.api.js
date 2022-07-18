import aws from 'aws-sdk'
import { AWSConfig } from '../../aws.config'
import path from 'path'
// export const S3_CONTENT_FOLDER = AWSConfig.aws.s3ugc
export const ACCESS_KEY = AWSConfig.aws.s3key
export const SECRET_KEY = AWSConfig.aws.s3pass
export const REGION = AWSConfig.aws.s3region
export const BUCKET_NAME = AWSConfig.aws.s3name

export const signCDNFile = async ({ fileName, folderPath = 'general' }) => {
  aws.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION,
    signatureVersion: 'v4',
  })
  let folder = AWSConfig.aws.getFolder(folderPath)

  const s3 = new aws.S3()
  const signature = await s3.createPresignedPost({
    Bucket: BUCKET_NAME,
    Fields: {
      // folder
      key: path.join(folder, fileName),
      ACL: 'public-read',
    },
    Expires: 240, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576 * 256], // up to 1 MB * 256
    ],
  })

  return signature
}

export const removeFile = async ({ fileS3 }) => {
  aws.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION,
    signatureVersion: 'v4',
  })

  const s3 = new aws.S3()

  let fileKey = fileS3.key
  if (!fileKey) {
    console.error('no file key')
    return
  }

  if (fileKey[0] === '/') {
    fileKey = fileKey.replace('/', '')
  }

  let deleteObj = {
    Bucket: fileS3.bucket,
    Key: fileKey,
  }

  s3.deleteObject(deleteObj, (err, data) => {
    if (err) {
      console.log('failed to deltet', err, err.stack)
      // error
    } else {
      console.log('successfully deleted')
    } // deleted
  })
}
