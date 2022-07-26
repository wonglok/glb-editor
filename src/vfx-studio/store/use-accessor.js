//onLoad().then((dat) => {})
//
import {
  loadBinaryByFileID,
  updateGLBBinary,
  loadMetadataByFileID,
  renameGLB,
} from 'vfx-studio/shared/storage'
import create from 'zustand'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export const useAccessor = create((set, get) => {
  return {
    glbObject: null,
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
          set({ glbObject: glb })
        })
      })
    },
  }
})
