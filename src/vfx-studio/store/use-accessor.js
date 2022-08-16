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
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'
import md5 from 'md5'
import { ObjectLoader } from 'three140'

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
        layout: 'full',
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
          //

          getPosMD5(glb2)

          getPosMD5(glb1)

          set({ glbObject: glb1, glbObjectBeforeEdit: glb2 })
        })
      })
    },
  }
})

let getJSON = (it) => {
  let str = ''

  if (it.geometry) {
    str += it.geometry.attributes.position.array.length
  }
  return str
  //
  // let nit = { ...it }
  // delete nit.geometry
  // delete nit.material
  // delete nit.effectnode
  // delete nit.children

  // return JSON.stringify(nit)
}
export const getPosMD5 = (glb) => {
  glb.scene.traverse((it) => {
    it.userData.posMD5 = md5(
      getJSON(it) +
        it.name +
        it.children.map((e) => e.name).join('_') +
        it?.parent?.name +
        it?.parent?.children?.map((e) => e.name).join('_') +
        it?.parent?.children.length
    )
  })
}

export const getArrayOfEditable = ({ glb: glbObject }) => {
  //
  let list = []
  glbObject?.scene?.traverse((it) => {
    if (it.geometry) {
      list.push(it)
    }
  })
  return list
}
