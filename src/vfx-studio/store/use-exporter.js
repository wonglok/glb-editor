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

import { VertexLayout, WebIO } from '@gltf-transform/core'
import { DracoMeshCompression } from '@gltf-transform/extensions'
import { FileLoader } from 'three140'
import { dedup, prune } from '@gltf-transform/functions'
// import {
//   dedup,
//   prune,
//   // quantize,
//   // reorder,
//   // resample,
//   // textureResize,
// } from '@gltf-transform/functions'

// import draco3d from 'draco3dgltf'

export const Exporter = {
  download: ({
    clips = [],
    group = new Object3D(),
    downloadName = 'export-glb',
    optimize = [1024, 1024],
    onDoneOptimizeBuffer = null,
  }) => {
    //
    return import('three140/examples/jsm/exporters/GLTFExporter.js').then(
      ({ GLTFExporter }) => {
        let cloned = clone(group)

        // let removeList = []
        // cloned.traverse((it) => {
        //   //
        //   if (it.userData.effectNode) {
        //     removeList.push({
        //       type: 'remove',
        //       it,
        //     })
        //   }

        //   if (it.userData.beforeMat) {
        //     delete it.userData.beforeMat
        //   }
        //   //
        //   // mesh.userData.beforeMat
        //   //
        // })

        // removeList.forEach((item) => {
        //   if (item.type === 'remove') {
        //     item.it.children.forEach((k) => {
        //       k.removeFromParent()
        //     })
        //   }
        // })

        //
        /*
        // This is a minimal example showing how to create the Draco encoder module.
        // The encoder module is created asynchronously, so you need to set a
        // callback to make sure it is initialized before you try and call the module.

        'use_strict';

        const draco3d = require('./draco3d');

        let encoderModule = null;

        // The code to create the encoder module is asynchronous.
        // draco3d.createEncoderModule will return a promise to a funciton with a
        // module as a parameter when the module has been fully initialized.
        draco3d.createEncoderModule({}).then(function(module) {
          // This is reached when everything is ready, and you can call methods on
          // Module.
          encoderModule = module;
          console.log('Encoder Module Initialized!');
          moduleInitialized();
        });

        function moduleInitialized() {
          let encoder = new encoderModule.Encoder();
          // Do the actual encoding here. See 'draco_nodejs_example.js' for a more
          // comprehensive example.
          cleanup(encoder);
        }

        function cleanup(encoder) {
          encoderModule.destroy(encoder);
        }
        */

        let glbObjectBeforeEdit = useAccessor.getState().glbObjectBeforeEdit
        let objectForExport = glbObjectBeforeEdit.scene

        cloned.traverse((pp) => {
          if (pp.userData.effectNode) {
            objectForExport.traverse((oo) => {
              if (oo.userData.posMD5 === pp.userData.posMD5) {
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

          forceIndice: false,
          includeCustomExtensions: true,
        }

        // let pending = false
        // let _loadLibrary = (url, responseType) => {
        //   const loader = new FileLoader()
        //   loader.setPath(`/draco/`)
        //   loader.setResponseType(responseType)
        //   loader.setWithCredentials(true)

        //   return new Promise((resolve, reject) => {
        //     loader.load(url, resolve, undefined, reject)
        //   })
        // }
        // let initEncoder = () => {
        //   if (pending) return pending

        //   const useJS = false

        //   const librariesPending = []

        //   if (useJS) {
        //     librariesPending.push(_loadLibrary('draco_encoder.js', 'text'))
        //   } else {
        //     librariesPending.push(_loadLibrary('draco_wasm_wrapper.js', 'text'))
        //     librariesPending.push(
        //       _loadLibrary('draco_encoder.wasm', 'arraybuffer')
        //     )
        //   }

        //   pending = Promise.all(librariesPending).then((libraries) => {
        //     const jsContent = libraries[0]

        //     if (!useJS) {
        //       this.decoderConfig.wasmBinary = libraries[1]
        //     }

        //     const fn = DRACOWorker.toString()

        //     const body = [
        //       '/* draco decoder */',
        //       jsContent,
        //       '',
        //       '/* worker */',
        //       fn.substring(fn.indexOf('{') + 1, fn.lastIndexOf('}')),
        //     ].join('\n')

        //     this.workerSourceURL = URL.createObjectURL(new Blob([body]))
        //   })

        //   return pending
        // }
        // /*

        //
        // */
        //

        // Parse the input and generate the glTF output
        exporter.parse(
          [...objectForExport.children],
          // called when the gltf has been generated
          async function (rawGltf) {
            // let rawBlob = new Blob([gltf], {
            //   type: 'application/octet-stream',
            // })

            // let rawUrl = URL.createObjectURL(rawBlob)

            let dracoMod = await remoteImport('/draco/draco_encoder_raw.js')

            const io = new WebIO({
              mode: 'cors',
              cache: 'no-cache',
            })

            // let draco3d = loadDraco()

            let mod = dracoMod.DracoEncoderModule()
            io.registerExtensions([DracoMeshCompression])
            io.registerDependencies({
              // 'draco3d.decoder': await draco3d.createDecoderModule(), // Optional.
              'draco3d.encoder': mod, // Optional.
            })

            let glbDocument = await io.readBinary(new Uint8Array(rawGltf))

            // await glbDocument.transform(
            //   // Remove duplicate vertex or texture data, if any.
            //   dedup(),

            //   // Losslessly resample animation frames.
            //   // resample(),

            //   // Remove unused nodes, textures, or other data.
            //   prune()

            //   // Resize all textures to ≤1K.
            //   // textureResize({ size: optimize })
            // )

            glbDocument
              .createExtension(DracoMeshCompression)
              .setRequired(true)
              .setEncoderOptions({
                method: DracoMeshCompression.EncoderMethod.SEQUENTIAL,
                encodeSpeed: 5,
                decodeSpeed: 5,
              })

            // io.setVertexLayout(VertexLayout.SEPARATE)

            let newBin = await io.writeBinary(glbDocument)

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
