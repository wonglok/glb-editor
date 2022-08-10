import { AnimationMixer } from 'three140'

export const exportGLB = ({ clips, group, mixer, onDone = () => {} }) => {
  //
  //

  import('three/examples/jsm/exporters/GLTFExporter.js').then(
    async ({ GLTFExporter }) => {
      let { clone } = await import('three/examples/jsm/utils/SkeletonUtils')

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

        //

        forceIndice: true,
        includeCustomExtensions: true,
      }
      /** @type {AnimationMixer} */
      let mymixer = mixer

      let clonedObject = clone(group)

      clonedObject.traverse((it) => {
        if (it.userData.beforeMat) {
          delete it.userData.beforeMat
        }
      })

      mymixer.stopAllAction()
      mymixer.update(1 / 60)
      // Parse the input and generate the glTF output
      exporter.parse(
        [clonedObject],
        // called when the gltf has been generated
        async function (gltf) {
          // let { WebIO } = await import('@gltf-transform/core')

          // let { prune, dedup, resample, textureResize } = await import(
          //   '@gltf-transform/functions'
          // )

          // let { DracoMeshCompression } = await import(
          //   '@gltf-transform/extensions'
          // )

          // // let rawBlob = new Blob([gltf], {
          // //   type: 'application/octet-stream',
          // // })

          // // let rawUrl = URL.createObjectURL(rawBlob)

          // const io = new WebIO({
          //   mode: 'cors',
          //   cache: 'no-cache',
          // })

          // let glbDocument = await io.readBinary(new Uint8Array(gltf))
          // // // let glbDocument = await io.read(rawUrl)

          // // /**
          // //  * simple_pipeline.js
          // //  *
          // //  * Short example of an glTF optimization pipeline implemented with
          // //  * the glTF-Transform (https://gltf-transform.donmccurdy.com/) API.
          // //  * Other common problems — e.g. high vertex or draw counts — may
          // //  * require working in other tools, like gltfpack or Blender.
          // //  */

          // await glbDocument.transform(
          //   // Remove duplicate vertex or texture data, if any.
          //   dedup(),

          //   // Losslessly resample animation frames.
          //   resample(),

          //   // Remove unused nodes, textures, or other data.
          //   prune(),

          //   // Resize all textures to ≤1K.
          //   textureResize({ size: [512, 512] })
          // )

          // glbDocument
          //   .createExtension(DracoMeshCompression)
          //   .setRequired(true)
          //   .setEncoderOptions({
          //     method: DracoMeshCompression.EncoderMethod.EDGEBREAKER,
          //     encodeSpeed: 5,
          //     decodeSpeed: 5,
          //   })

          // let newBin = await io.writeBinary(glbDocument)
          // // let newBin = gltf

          let newFile = new Blob([gltf], {
            type: 'application/octet-stream',
          })

          let newURL = URL.createObjectURL(newFile)

          let ahr = document.createElement('a')
          ahr.href = newURL
          ahr.download = 'avatar.glb'
          ahr.click()
          //

          //

          onDone()
        },
        // called when there is an error in the generation
        function (error) {
          console.log(error, 'An error happened')
        },
        options
      )
    }
  )
}
