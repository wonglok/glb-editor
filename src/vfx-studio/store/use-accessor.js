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
    setGlbObjectBeforeEdit: (v) => {
      set({ glbObjectBeforeEdit: v })
    },
    loadBfferGLB: (fileID) => {
      set({ glbObject: null, glbObjectBeforeEdit: null })

      set({ fileID })

      loadMetadataByFileID(fileID).then((metadata) => {
        set({ glbMetadata: metadata })
      })

      return loadBinaryByFileID(fileID).then((buffer) => {
        let loader = new GLTFLoader()
        let draco = new DRACOLoader()
        draco.setDecoderPath(`/draco/`)
        draco.setCrossOrigin('')
        loader.setDRACOLoader(draco)

        if (!buffer) {
          return
        }
        return Promise.all([
          loader.parseAsync(buffer, '/'),
          loader.parseAsync(buffer, '/'),
        ]).then(([glb1, glb2]) => {
          //
          getPosMD5(glb1)

          getPosMD5(glb2)

          set({ glbObject: glb1, glbObjectBeforeEdit: glb2 })
        })
      })
    },
  }
})

export const getPosMD5 = (glb) => {
  glb.scene.traverse((it) => {
    it.userData.posMD5 = md5(getSignature(it))
  })
}

let getSignature = (it) => {
  let str = '' + it.name

  if (it.geometry) {
    str += it.geometry.attributes.position?.array?.length + '-'
    str += it.geometry.attributes.normal?.array?.length + '-'
  }

  let k = 0
  it.traverse((sb) => {
    str += `${k}-${sb.name}`
    k += 1
  })

  // console.log(str)
  return str
}

export const getArrayOfEditable = ({ glb: glbObject }) => {
  //
  let list = []
  glbObject?.scene?.traverse((it) => {
    if (it) {
      list.push(it)
    }
  })

  //
  return list
}
