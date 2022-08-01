import { fileOpen, directoryOpen, fileSave, supported } from 'browser-fs-access'
import { useEffect, useState } from 'react'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { Object3D } from 'three140'
export default function FBX() {
  let [show, setShow] = useState(false)
  useEffect(() => {
    setShow(true)

    return () => {}
  }, [])

  return (
    <div>
      {(show &&
        (supported
          ? 'Using the File System Access API.'
          : 'Using the fallback implementation.')) ||
        ''}

      <button
        onClick={async () => {
          // recursively including subdirectories.
          const blobsInDirectory = await directoryOpen({
            recursive: true,
          }).catch((s) => {
            console.log(s)
            return false
          })

          if (blobsInDirectory) {
            // console.log(blobsInDirectory)
            let fbxs = blobsInDirectory.filter(
              (e) => e.name.indexOf('.fbx') !== -1
            )

            let proms = Promise.all(
              fbxs.map(async (it) => {
                //
                //
                let fbxLoader = new FBXLoader()
                let fbx = fbxLoader.parse(await it.arrayBuffer())
                //
                it.fbx = fbx

                it.animation = fbx.animations[0]
                it.animation.name = it.name.replace('.fbx', '')
                return it
              })
            )

            let o3 = new Object3D()
            proms.then((fbxs) => {
              //

              let clips = []

              fbxs.forEach((e) => {
                clips.push(e.animation)
                o3.add(e.fbx)
              })

              const exporter = new GLTFExporter()
              const options = {
                binary: true,
                trs: false,

                onlyVisible: false,
                truncateDrawRange: false,
                binary: true,
                maxTextureSize: Infinity,
                animations: clips,
                forceIndice: true,
                includeCustomExtensions: true,
              }

              exporter.parseAsync(o3, options).then(async (arrayBuffer) => {
                //
                // let newFile = new Blob([arrayBuffer], {
                //   type: 'application/octet-stream',
                // })
                //

                let { WebIO } = await import('@gltf-transform/core')
                let { resample } = await import('@gltf-transform/functions')

                // let rawBlob = new Blob([gltf], {
                //   type: 'application/octet-stream',
                // })

                // let rawUrl = URL.createObjectURL(rawBlob)

                const io = new WebIO({
                  mode: 'cors',
                  cache: 'no-cache',
                })

                let glbDocument = await io.readBinary(
                  new Uint8Array(arrayBuffer)
                )
                // // let glbDocument = await io.read(rawUrl)

                // /**
                //  * simple_pipeline.js
                //  *
                //  * Short example of an glTF optimization pipeline implemented with
                //  * the glTF-Transform (https://gltf-transform.donmccurdy.com/) API.
                //  * Other common problems — e.g. high vertex or draw counts — may
                //  * require working in other tools, like gltfpack or Blender.
                //  */

                await glbDocument.transform(
                  // Losslessly resample animation frames.
                  resample()
                )

                let newBin = await io.writeBinary(glbDocument)
                // let newBin = gltf

                fileSave(newBin, {
                  fileName: 'combined-motion.glb',
                  extensions: ['.glb'],
                })
                //
              })
            })
          }
        }}
      >
        Select
      </button>
    </div>
  )
}
