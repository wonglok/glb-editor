import { useAvatarForge } from '@/vfx-meta/store/use-avatar-forge'
import Dropzone from 'react-dropzone'

export function AvatarForge() {
  return (
    <div>
      {/*  */}
      {/*  */}
      <div>
        <AvatarGenerationButton></AvatarGenerationButton>
      </div>
      <div className='flex h-32'>
        <AvatarZone></AvatarZone>
        <MotionZone></MotionZone>
      </div>
    </div>
  )
}

function AvatarGenerationButton() {
  let clips = useAvatarForge((s) => s.clips)
  let avatar = useAvatarForge((s) => s.avatar)
  let exportAvatar = useAvatarForge((s) => s.exportAvatar)

  //
  return (
    <div>
      {clips && clips.length > 0 && avatar && (
        <>
          <button
            onClick={() => {
              //
              exportAvatar({
                // onDone: ({ url, blob, buffer }) => {
                //   //
                // },
              })
            }}
          >
            Download
          </button>
        </>
      )}
    </div>
  )
}

function MotionZone() {
  let setClipsByFiles = useAvatarForge((s) => s.setClipsByFiles)
  let clips = useAvatarForge((s) => s.clips)
  return (
    <div>
      <Dropzone
        onDrop={(acceptedFiles) => {
          let arr = []
          for (let kn in acceptedFiles) {
            arr[Number(kn)] = acceptedFiles[kn]
          }

          setClipsByFiles(arr.filter((e) => e.name.includes('.fbx')))
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {!(clips && clips.length > 0) ? (
                <div className='p-12 mb-2 mr-2 bg-gray-200'>
                  Drop Motion Files
                </div>
              ) : (
                <div className='p-12 mb-2 mr-2 bg-gray-200'>
                  MotionZone
                  <br></br>
                  <ul>
                    {clips.map((e) => (
                      <li key={e.uuid}>{e.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  )
}

function AvatarZone() {
  let setAvatarObjectByOneFile = useAvatarForge(
    (s) => s.setAvatarObjectByOneFile
  )
  let avatar = useAvatarForge((s) => s.avatar)

  return (
    <div>
      <Dropzone
        onDrop={(acceptedFiles) => {
          let arr = []
          for (let kn in acceptedFiles) {
            arr[Number(kn)] = acceptedFiles[kn]
          }
          arr.filter((e) => e.name.includes('.glb'))

          if (arr[0]) {
            setAvatarObjectByOneFile(arr[0])
          }
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {!avatar ? (
                <div className='p-12 mb-2 mr-2 bg-gray-200'>
                  Drop Avatar Files
                </div>
              ) : (
                <div className='p-12 mb-2 mr-2 bg-gray-200'>{avatar.name}</div>
              )}
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  )
}
