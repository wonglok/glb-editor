import localforage from 'localforage'
import { getID } from '@/vfx-runtime/ENUtils'

export const GLBMetadata = localforage.createInstance({
  name: 'GLBMetadata',
})

export const GLBBinary = localforage.createInstance({
  name: 'GLBBinary',
})

export const EffectNodeRecovery = localforage.createInstance({
  name: 'EffectNodeRecovery',
})

export const loadFilesMetadata = () => {
  return GLBMetadata.keys()
    .then(async (keys) => {
      let items = []

      for (let key of keys) {
        let obj = await GLBMetadata.getItem(key)
        items.push(obj)
      }
      return items
    })
    .then((it) => {
      console.log(it)

      return it
    })
}

//
export const loadBinaryByFileID = async (fileID) => {
  //
  let arrayBuffer = await GLBBinary.getItem(fileID)

  //
  //
  return arrayBuffer
}

export const loadMetadataByFileID = async (fileID) => {
  //
  let metadata = await GLBMetadata.getItem(fileID)

  //
  //
  return metadata
}

export const writeGLB = async ({ name, buffer }) => {
  let fileID = getID()

  await Promise.all([
    GLBBinary.setItem(fileID, buffer),
    GLBMetadata.setItem(fileID, {
      name,
      fileID,
    }),
  ])
}

export const updateGLBBinary = async ({ fileID, buffer }) => {
  await Promise.all([
    //
    GLBBinary.setItem(fileID, buffer),
  ])
}

export const renameGLB = async ({ fileID, name }) => {
  let obj = await GLBMetadata.getItem(fileID)
  if (obj) {
    await Promise.all([
      GLBMetadata.setItem(fileID, {
        ...obj,
        name: name,
        fileID,
      }),
    ])
    //
  }
}

export const removeGLB = async (fileID) => {
  // let fileID = getID()
  // await Promise.all([
  //   GLBBinary.setItem(fileID, buffer),
  //   GLBMetadata.setItem(fileID, {
  //     name,
  //     fileID,
  //   }),
  // ])

  await Promise.all([
    GLBBinary.removeItem(fileID),
    GLBMetadata.removeItem(fileID),
  ])
  //

  return
}
