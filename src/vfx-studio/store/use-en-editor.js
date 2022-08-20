import { Vector3 } from 'three'
import { Object3D } from 'three140'
import path from 'path'
import create from 'zustand'

export const getID = function () {
  return (
    '_' +
    Math.random().toString(36).substr(2, 9) +
    Math.random().toString(36).substr(2, 9)
  )
}

export const useENEditor = create((set, get) => {
  //
  let r = require.context('../../vfx-nodes/', true, /\.en\.js$/, 'lazy')

  function importAll(r) {
    let arr = []
    r.keys().forEach((key) => {
      let filename = path.basename(key)
      filename = filename.replace('.en.js', '')

      if (!arr.map((e) => e.title).includes(filename)) {
        arr.push({
          key,
          title: filename,
          loader: () => r(key),
        })
      }
    })

    // console.log(arr)

    return arr
  }

  let codes = importAll(r)
  let effectNodeMap = new Map()
  let curosrPoint = new Object3D()
  curosrPoint.userData.down = new Vector3()
  curosrPoint.userData.added = new Vector3()
  curosrPoint.userData.diff = new Vector3()
  return {
    codes,
    overlay: null,

    activeNodeID: '',
    setActiveNodeID: (id) => {
      set({ activeNodeID: id })
    },
    getActiveNode: () => {
      let { effectNodeID, effectNodeMap, activeNodeID } = get()
      let effectNode = effectNodeMap.get(effectNodeID)
      let nodes = effectNode?.nodes || []
      return nodes?.find((e) => e._id === activeNodeID)
      //
    },
    setOverlay: (v) => {
      set({ overlay: v })
    },

    //
    control: null,
    setControl: (ctrl) => {
      set({ control: ctrl })
    },

    cursorMode: 'ready',
    curosrPoint,

    nodeDrag: false,
    setNodeDrag: (node) => {
      //
      set({ nodeDrag: node })
    },

    //
    chosenCodeID: '',
    selectCodeToAdd: ({ codeID }) => {
      //
      set({ chosenCodeID: codeID, cursorMode: 'add' })
    },
    addLink: (v) => {
      //
      let { getEffectNode, effectNodeID } = get()
      //
      let effectNode = getEffectNode()

      /*
      let result = {
        _id: getID(),
        input: res.input.socket,
        output: res.output.socket,
      }
      */
      effectNode.connections.push(v)
      set({ effectNodeID: effectNodeID })
      set({ reloadGraphID: Math.random() })
    },
    removeLink: (link) => {
      let { getEffectNode, effectNodeID } = get()
      let effectNode = getEffectNode()
      effectNode.connections.splice(
        effectNode.connections.findIndex((s) => s._id === link._id),
        1
      )

      set({ effectNodeID: effectNodeID })
      set({ reloadGraphID: Math.random() })
      //
    },

    removeNode: (node) => {
      let { getEffectNode, effectNodeID } = get()
      let effectNode = getEffectNode()
      effectNode.nodes.splice(
        effectNode.nodes.findIndex((s) => s._id === node._id),
        1
      )
      set({ effectNodeID: effectNodeID })
      set({ reloadGraphID: Math.random() })
      //
    },
    addByPlacing: async () => {
      //
      let { effectNodeID, chosenCodeID: codeID, effectNodeMap } = get()

      //
      let code = codes.find((s) => s.title === codeID)

      code.loader().then(async (mod) => {
        let effectNode = effectNodeMap.get(effectNodeID)

        let nodeID = getID()
        let _id = nodeID

        let customData = (await mod.nodeData({ defaultData: {}, nodeID })) || {}
        effectNode.nodes.push({
          _id,
          nodeID,
          codeID,
          displayTitle: code.title,
          position: curosrPoint.position.toArray(),

          //
          inputs: [
            //
            { _id: getID(), type: 'input', nodeID },
            { _id: getID(), type: 'input', nodeID },
            { _id: getID(), type: 'input', nodeID },
          ],

          //
          outputs: [
            //
            { _id: getID(), type: 'output', nodeID },
            { _id: getID(), type: 'output', nodeID },
            { _id: getID(), type: 'output', nodeID },
          ],

          //
          uniforms: [
            {
              _id: getID(),
              nodeID,
              name: 'position',
              type: 'vec3',
              value: { x: 0, y: 0, z: 0 },
            },
            {
              _id: getID(),
              nodeID,
              name: 'rotation',
              type: 'vec3',
              value: { x: 0, y: 0, z: 0 },
            },
            {
              _id: getID(),
              nodeID,
              name: 'scale',
              type: 'vec3',
              value: { x: 1, y: 1, z: 1 },
            },
          ],

          ...customData,
        })

        // console.log(effectNode)
        set({ reloadGraphID: Math.random() })

        set({
          cursorMode: 'ready',
        })
      })
    },

    effectNodeID: '',
    effectNodeMap,
    setEffectNode: ({ uuid, effectNode }) => {
      effectNodeMap.set(uuid, effectNode)
      set({ effectNodeID: uuid })
      //
    },
    getEffectNode: () => {
      let { effectNodeID, effectNodeMap } = get()
      let effectNode = effectNodeMap.get(effectNodeID)

      return effectNode
    },
    //
    //
    //
    //
    //

    isDown: false,
    setDown: (isDown) => {
      set({ isDown })
    },
    draggingIOID: false,
    setDraggingIOID: (v) => {
      set({ draggingIOID: v })
    },

    ///
    ///
    dragStartPos: new Vector3(),

    reloadGraphID: 0,
    //
    reloadGraph: () => {
      set({ reloadGraphID: Math.random() })
    },
  }
})
