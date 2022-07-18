import path from 'path'
export const AWSConfig = {
  aws: {
    getFolder: (type) => {
      return path.join('multiverse', process.env.NODE_ENV, type)
    },
    s3cdn: `https://dhjz4fdyjzwki.cloudfront.net`,

    s3name: process.env.S3_BUCKET_NAME,
    s3region: process.env.S3_BUCKET_REGION,
    s3key: process.env.S3_BUCKET_API_KEY,
    s3pass: process.env.S3_BUCKET_API_PASSWORD,
  },
}

//""
