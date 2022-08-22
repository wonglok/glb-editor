import { useEffect, useRef, useState } from 'react'
import { Core } from '@/vfx-core/Core'
import { getID } from '@/vfx-runtime/ENUtils'
import {
  // GLBMetadata,
  loadBinaryByFileID,
  loadFilesMetadata,
  removeGLB,
  renameGLB,
} from '@/vfx-studio/shared/storage'
// import { Exporter } from '../store/use-exporter'
// import { GLTFLoader } from 'three140/examples/jsm/loaders/GLTFLoader'
// import { DRACOLoader } from 'three140/examples/jsm/loaders/DRACOLoader'

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
  let renameRef = useRef()
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
                    ref={renameRef}
                    onInput={(ev) => {
                      renameGLB({
                        fileID: file.fileID,
                        name: ev.target.value,
                      }).then(() => {
                        loadFilesMetadata().then((array) => {
                          setFiles(array)
                        })
                      })
                    }}
                  ></textarea>
                  <button
                    className='p-2 mr-1 bg-blue-200'
                    onClick={() => {
                      //
                      onOpen(file)
                    }}
                  >
                    Open
                  </button>

                  <button
                    className='p-2 mr-1 bg-red-200'
                    onClick={() => {
                      if (window.confirm('remove??')) {
                        removeGLB(file.fileID)
                        Core.now.reloadFileList = getID()
                      }
                    }}
                  >
                    Remove file
                  </button>

                  <button
                    className='p-2 mr-1 bg-green-200'
                    onClick={(ev) => {
                      ev.target.innerText = 'Optimising, Exporting....'

                      loadBinaryByFileID(file.fileID).then((buffer) => {
                        let newFile = new Blob([buffer], {
                          type: 'application/octet-stream',
                        })

                        let newURL = URL.createObjectURL(newFile)

                        let ahr = document.createElement('a')
                        ahr.href = newURL
                        ahr.download = file.name

                        if (ahr.download.indexOf('.glb') === -1) {
                          ahr.download = ahr.download + '.glb'
                        }
                        ahr.click()

                        setTimeout(() => {
                          ev.target.innerText = 'Download file'
                        }, 1000)
                      })
                    }}
                  >
                    Download file
                  </button>
                </div>
              )
            })
          : null}
      </>
    </div>
  )
}
