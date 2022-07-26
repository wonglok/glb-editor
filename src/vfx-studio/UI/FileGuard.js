import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { loadMetadataByFileID } from '@/vfx-studio/shared/storage'

export function FileGuard({ fileID, children }) {
  let [valid, setValid] = useState(null)

  useEffect(() => {
    if (!fileID) {
      return
    }
    loadMetadataByFileID(fileID).then(
      (v) => {
        console.log('chekcing file')
        if (v && v !== null && typeof v === 'object') {
          setValid(true)
        } else {
          setValid(false)
        }
      },
      () => {
        setValid(false)
      }
    )
  }, [fileID])
  return (
    <>
      {valid === true ? (
        <>{children}</>
      ) : (
        <>{valid === null ? <>Loading...</> : <>Not Found</>}</>
      )}
    </>
  )
}

//
