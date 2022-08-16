//onLoad().then((dat) => {})
//
import {
  loadBinaryByFileID,
  updateGLBBinary,
  loadMetadataByFileID,
  renameGLB,
} from '@/vfx-studio/shared/storage'
import create from 'zustand'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import md5 from 'md5'

export const useAccessor = create((set, get) => {
  return {
    glbObject: null,
    glbObjectBeforeEdit: null,
    glbMetadata: null,
    fileID: null,

    selectedMeshes: [],

    control: null,
    setContorl: (control) => {
      set({ control })
    },

    ///

    layout: 'full',
    setLayout: (v) => {
      set({ layout: v })
    },

    openEffectNode: (mesh) => {
      mesh.userData.effectNode = mesh.userData.effectNode || {
        nodes: [],
        connections: [],
      }

      set({
        selectedMeshes: [mesh],
        layout: 'effectnode',
      })
    },

    removeEffectNode: (mesh) => {
      delete mesh.userData.effectNode
      set({
        selectedMeshes: [],
      })
      setTimeout(() => {
        set({
          layout: 'full',
        })
      })
    },
    ///
    updateSelected: (meshes) => {
      set({ selectedMeshes: meshes })
    },

    setupControl: ({ name, control }) => {
      set({ activeControl: name, control })
    },

    //
    updateGLBBinary: ({ fileID, buffer }) => {
      updateGLBBinary({ fileID, buffer })
    },
    renameGLB: ({ fileID, name }) => {
      //
      renameGLB({ fileID, name })
      //
    },
    loadBfferGLB: (fileID) => {
      set({ glbObject: null, glbObjectBeforeEdit: null })

      set({ fileID })

      loadMetadataByFileID(fileID).then((metadata) => {
        set({ glbMetadata: metadata })
      })
      //

      loadBinaryByFileID(fileID).then((buffer) => {
        let loader = new GLTFLoader()
        let draco = new DRACOLoader()
        draco.setDecoderPath(`/draco/`)
        draco.setCrossOrigin('')
        loader.setDRACOLoader(draco)

        Promise.all([
          loader.parseAsync(buffer, '/'),
          loader.parseAsync(buffer, '/'),
        ]).then(([glb1, glb2]) => {
          let i1 = 0
          glb1.scene.traverse((it) => {
            if (it.geometry) {
              it.userData.posMD5 = md5(
                it.geometry.attributes.position.array.length + it.name
              )
            }

            it.userData.enUUID = 'uuid' + i1
            i1++
          })

          let i2 = 0
          glb2.scene.traverse((it) => {
            if (it.geometry) {
              it.userData.posMD5 = md5(
                it.geometry.attributes.position.array.length + it.name
              )
            }

            it.userData.enUUID = 'uuid' + i2
            i2++
          })

          set({ glbObject: glb1, glbObjectBeforeEdit: glb2 })
        })
      })
    },
  }
})
