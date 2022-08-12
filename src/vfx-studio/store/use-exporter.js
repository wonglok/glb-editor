// import {
//   prune,
//   dedup,
//   resample,
//   textureResize,
// } from '@gltf-transform/functions'
// import { VertexLayout, WebIO } from '@gltf-transform/core'
// import { DracoMeshCompression } from '@gltf-transform/extensions'
import { Object3D } from 'three'
import { clone } from 'three140/examples/jsm/utils/SkeletonUtils'
import { useAccessor } from './use-accessor'
import { getID } from './use-en-editor'

export const Exporter = {
  download: ({
    clips = [],
    group = new Object3D(),
    downloadName = 'opsimitsedGLB',
    optimize = [1024, 1024],
    onDoneOptimizeBuffer = null,
  }) => {
    //
    return import('three140/examples/jsm/exporters/GLTFExporter.js').then(
      ({ GLTFExporter }) => {
        let cloned = clone(group)

        let removeList = []
        cloned.traverse((it) => {
          //
          if (it.userData.effectNode) {
            removeList.push({
              type: 'remove',
              it,
            })
          }

          if (it.userData.beforeMat) {
            delete it.userData.beforeMat
          }
          //
          // mesh.userData.beforeMat
          //
        })

        removeList.forEach((item) => {
          if (item.type === 'remove') {
            item.it.children.forEach((k) => {
              k.removeFromParent()
            })
          }
        })

        let glbObjectBeforeEdit = useAccessor.getState().glbObjectBeforeEdit
        let objectForExport = glbObjectBeforeEdit.scene

        //

        cloned.traverse((pp) => {
          if (pp.userData.effectNode) {
            objectForExport.traverse((oo) => {
              if (oo.userData.enUUID === pp.userData.enUUID) {
                oo.userData.effectNode = JSON.parse(
                  JSON.stringify(pp.userData.effectNode)
                )
              }
            })
          }
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

          // .filter((aa) => {
          //   return aa.name.indexOf('mixamo') === 0
          // })
          // .map((e) => {
          //   let a = e.clone()
          //   a.validate()

          //   return a
          // }),
          forceIndice: true,
          includeCustomExtensions: true,
        }

        // Parse the input and generate the glTF output
        exporter.parse(
          [objectForExport],
          // called when the gltf has been generated
          async function (gltf) {
            //

            // let rawBlob = new Blob([gltf], {
            //   type: 'application/octet-stream',
            // })

            // let rawUrl = URL.createObjectURL(rawBlob)

            // const io = new WebIO({
            //   mode: 'cors',
            //   cache: 'no-cache',
            // })

            // let glbDocument = await io.readBinary(new Uint8Array(gltf))
            // // let glbDocument = await io.read(rawUrl)

            // /**
            //  * simple_pipeline.js
            //  *
            //  * Short example of an glTF optimization pipeline implemented with
            //  * the glTF-Transform (https://gltf-transform.donmccurdy.com/) API.
            //  * Other common problems — e.g. high vertex or draw counts — may
            //  * require working in other tools, like gltfpack or Blender.
            //  */

            // await glbDocument.transform(
            //   // Remove duplicate vertex or texture data, if any.
            //   dedup(),

            //   // Losslessly resample animation frames.
            //   resample(),

            //   // Remove unused nodes, textures, or other data.
            //   prune(),

            //   // Resize all textures to ≤1K.
            //   textureResize({ size: optimize })
            // )

            // glbDocument
            //   .createExtension(DracoMeshCompression)
            //   .setRequired(true)
            //   .setEncoderOptions({
            //     method: DracoMeshCompression.EncoderMethod.EDGEBREAKER,
            //     encodeSpeed: 5,
            //     decodeSpeed: 5,
            //   })

            // io.setVertexLayout(VertexLayout.SEPARATE)
            // let newBin = await io.writeBinary(glbDocument)

            let newBin = gltf

            if (!onDoneOptimizeBuffer) {
              let newFile = new Blob([newBin], {
                type: 'application/octet-stream',
              })

              let newURL = URL.createObjectURL(newFile)

              let ahr = document.createElement('a')
              ahr.href = newURL
              ahr.download = downloadName + '.glb'
              ahr.click()
            } else {
              let newFile = new Blob([newBin], {
                type: 'application/octet-stream',
              })
              onDoneOptimizeBuffer(await newFile.arrayBuffer())
            }

            //

            //
          },
          // called when there is an error in the generation
          function (error) {
            console.log(error, 'An error happened')
          },
          options
        )
      }
    )
  },
}
