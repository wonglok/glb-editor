import slugify from 'slugify'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { DRACOLoader } from 'three140/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three140/examples/jsm/loaders/GLTFLoader'
import { Exporter } from '@/vfx-studio/store/use-exporter.js'
import create from 'zustand'
import { GLTFExporter } from 'three140/examples/jsm/exporters/GLTFExporter'
import { DracoMeshCompression } from '@gltf-transform/extensions'
import { WebIO } from '@gltf-transform/core'

export const useAvatarForge = create((set, get) => {
  //
  return {
    //
    avatar: false,
    clips: [],

    exportAvatar: async () => {
      //
      let { avatar, clips } = get()

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
      avatar.scene.name = 'avatar'

      avatar.scene.rotation.x = Math.PI * -0.5
      //
      let rawGLBBuffer = await exporter.parseAsync([avatar.scene], options)

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

      let glbDocument = await io.readBinary(new Uint8Array(rawGLBBuffer))

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

      let compressedBuffer = await io.writeBinary(glbDocument)

      let exportBuffer = compressedBuffer
      let newFile = new Blob([exportBuffer], {
        type: 'application/octet-stream',
      })

      let newURL = URL.createObjectURL(newFile)

      let ahr = document.createElement('a')
      ahr.href = newURL
      ahr.download = 'avatar' + '.glb'
      ahr.click()

      //
    },

    setAvatarObjectByOneFile: async (file) => {
      // set({ avatarObject: v })
      let loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/')
      loader.setDRACOLoader(dracoLoader)

      let avatar = await loader.loadAsync(URL.createObjectURL(file))
      avatar.name = file.name
      set({ avatar: avatar })
    },
    setClipsByFiles: (files) => {
      Promise.all(
        files.map((e) => {
          return new Promise(async (resolve) => {
            let laoder = new FBXLoader()

            laoder.loadAsync(URL.createObjectURL(e)).then((fbx) => {
              let name = slugify(e.name.replace('.fbx', ''), '_')

              let clip = fbx.animations[0]
              if (clip) {
                clip.name = name
                resolve(clip)
              }
            })
          })
        })
      ).then((items) => {
        set({ clips: items.filter((e) => e) })
      })
      // set({ clips: v })
    },
  }
})

//
