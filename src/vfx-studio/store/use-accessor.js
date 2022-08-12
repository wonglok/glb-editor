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
      })
      setTimeout(() => {
        set({
          layout: 'effectnode',
        })
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

        //

        loader.parse(buffer, '/', (glb) => {
          let i = 0
          glb.scene.traverse((it) => {
            it.userData.enUUID = 'uuid' + i
            i++
          })

          set({ glbObject: glb })
        })

        //
        loader.parse(buffer, '/', (glb) => {
          let i = 0
          glb.scene.traverse((it) => {
            it.userData.enUUID = 'uuid' + i
            i++
          })

          set({ glbObjectBeforeEdit: glb })
        })
      })
    },
  }
})
