import md5 from 'md5'
import slugify from 'slugify'

///  fetch(`https://dhjz4fdyjzwki.cloudfront.net/ugc-0001/reign-abarintos--cKXtsJWU-I-unsplash.jpg`, { mode: 'cors' }).then(e => e.arrayBuffer()).then(console.log)

async function onResponseJSON(r) {
  if (r.status === 200 || r.status === 206 || r.status === 304) {
    return r.json()
  } else {
    return Promise.reject(`Error Code ${r.status} ${await r.text()}`)
  }
}

export async function removeS3({ fileS3 }) {
  let result = await fetch(`/api/aws/remove`, {
    method: 'POST',
    body: JSON.stringify({
      fileS3,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (result.ok) {
    return Promise.resolve('remove successful')
  } else {
    return Promise.reject('remove failed')
  }
}

export async function uploadS3({ file, folderPath = 'general' }) {
  //

  //
  let arr = file.name.split('.')
  let ext = arr.pop()
  let filename = arr.join('.')

  let signName = `${filename}-${md5(
    file.name + file.size + file.lastModified + Math.random()
  )}.${ext}`

  signName = slugify(signName)

  //
  let { signature } = await fetch(`/api/aws/upload`, {
    method: 'POST',
    body: JSON.stringify({
      fileName: signName,
      folderPath: folderPath,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(onResponseJSON)
    .then((e) => {
      console.log(e)
      return e
    })

  let { fields, url } = signature

  //
  const formData = new FormData()
  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value)
  })

  let s3RemoveKey = fields.key

  let upload = await fetch(url, {
    method: 'POST',
    body: formData,
    mode: 'cors',
  })

  if (upload.ok) {
    console.log('upload is okay')

    /*
    fileInfo:
ACL: "public-read"
Policy: ""
X-Amz-Algorithm: "?"
X-Amz-Credential: "?"
X-Amz-Date: "?"
X-Amz-Signature: "?"
bucket: "?"
key: "?" // remove key
    */
    return Promise.resolve({
      fileBlob: file,
      fileKey: s3RemoveKey,
      fileInfo: fields,
    })
  } else {
    console.log(await upload.text())
    return Promise.reject('upload failed')
  }
}
