import { useEffect, useState } from 'react'
import { Core } from 'vfx-core/Core'
import { getID } from 'vfx-runtime/ENUtils'
import {
  GLBMetadata,
  loadFilesMetadata,
  removeGLB,
  renameGLB,
} from 'vfx-studio/shared/storage'

export function MyFiles({ onOpen = () => {} }) {
  Core.react.reloadFileList

  let [files, setFiles] = useState([])
  useEffect(() => {
    //GLBMetadata
    //

    loadFilesMetadata().then((array) => {
      setFiles(array)
    })

    //
    //
  }, [Core.now.reloadFileList])

  //
  return (
    <div>
      <div>File List</div>
      <>
        {files
          ? files.map((file) => {
              return (
                <div key={file.fileID}>
                  <textarea
                    cols={40}
                    defaultValue={file.name}
                    onInput={(ev) => {
                      renameGLB({
                        fileID: file.fileID,
                        name: ev.target.value,
                      })
                    }}
                  ></textarea>
                  <button
                    className='p-2 bg-blue-200 mr-1'
                    onClick={() => {
                      //
                      onOpen(file)
                    }}
                  >
                    Open
                  </button>

                  <button
                    className='p-2 bg-red-200 mr-1'
                    onClick={() => {
                      if (window.confirm('remove??')) {
                        removeGLB(file.fileID)
                        Core.now.reloadFileList = getID()
                      }
                    }}
                  >
                    Remove file
                  </button>
                </div>
              )
            })
          : null}
      </>
    </div>
  )
}
