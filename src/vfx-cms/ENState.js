import { Vector3 } from 'three'
import { getCodes } from '../vfx-runtime/ENRuntime'
import { getID, makeShallowStore } from '../vfx-runtime/ENUtils'
import { firebase } from './firebase'
export const ENState = makeShallowStore({
  listing: [],
  listingReload: 0,

  layouts: [],
  layoutsReload: 0,

  //
  canvasID: false,
  canvasOwnerID: false,

  // overlay
  overlay: '',

  // position
  cursorMode: 'ready',
  hovering: 'floor',
  draggingNodeID: false,
  draggingIOID: false,
  addNodeTitle: 'mytitle',

  cursorAt: new Vector3(),
  dragStartPos: new Vector3(),
  moved: 0,
  isDown: false,

  nodes: [],
  connections: [],

  currentEditSocketID: false,
  currentEditNodeID: false,

  reloadBrowser: 0,

  overlayTab: 'node',
})

export class ENMethods {
  static addCodeBlock({ point }) {
    ENState.overlay = ''
    ENState.cursorMode = 'ready'
    ENState.hovering = 'floor'

    let ref = firebase
      .database()
      .ref(`/canvas/${ENState.canvasID}/${ENState.canvasOwnerID}/nodes`)

    let newItem = ref.push()

    let nodeID = getID()

    //

    let defaultData = {
      title: ENState.addNodeTitle,

      //
      _firebaseKey: newItem.key,
      _id: nodeID,

      //
      position: point.toArray(),

      //
      inputs: [
        //
        { _id: getID(), type: 'input', nodeID },
        { _id: getID(), type: 'input', nodeID },
        { _id: getID(), type: 'input', nodeID },
        { _id: getID(), type: 'input', nodeID },
        { _id: getID(), type: 'input', nodeID },
        { _id: getID(), type: 'input', nodeID },
        { _id: getID(), type: 'input', nodeID },
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
        { _id: getID(), type: 'output', nodeID },
        { _id: getID(), type: 'output', nodeID },
        { _id: getID(), type: 'output', nodeID },
        { _id: getID(), type: 'output', nodeID },
        { _id: getID(), type: 'output', nodeID },
        { _id: getID(), type: 'output', nodeID },
        { _id: getID(), type: 'output', nodeID },
      ],

      //
      materials: [
        //
        //
      ],

      //
      shaders: [
        { _id: getID(), name: 'vertex', type: 'vertex', nodeID },
        { _id: getID(), name: 'fragment', type: 'fragment', nodeID },
        { _id: getID(), name: 'compute', type: 'fragment', nodeID },
      ],
    }
    let object = getCodes().find((e) => e.title === ENState.addNodeTitle)

    if (object) {
      object.loader().then(async (esm) => {
        if (esm.nodeData) {
          let data = await esm.nodeData({ defaultData, nodeID })
          newItem.set(data)
        } else {
          newItem.set(defaultData)
        }
      })
    } else {
      newItem.set(defaultData)
    }

    //
    ENState.reloadBrowser++
  }

  static saveCodeBlock({ node }) {
    let ref = firebase
      .database()
      .ref(
        `/canvas/${ENState.canvasID}/${ENState.canvasOwnerID}/nodes/${node._fid}`
      )

    return ref.set(node.data)
  }

  static removeCodeBlockByID({ nodeID }) {
    let ref = firebase
      .database()
      .ref(
        `/canvas/${ENState.canvasID}/${ENState.canvasOwnerID}/nodes/${nodeID}`
      )

    ref.remove()

    ENState.reloadBrowser++
  }

  static addLink({ input, output }) {
    let ref = firebase
      .database()
      .ref(`/canvas/${ENState.canvasID}/${ENState.canvasOwnerID}/connections`)

    let newItem = ref.push()

    newItem.set({
      _id: getID(),
      input,
      output,
    })

    ENState.reloadBrowser++
  }

  static removeLinkByID({ linkID }) {
    let ref = firebase
      .database()
      .ref(
        `/canvas/${ENState.canvasID}/${ENState.canvasOwnerID}/connections/${linkID}`
      )

    ref.remove()

    ENState.reloadBrowser++
  }

  static removeCurrentNodeAndConnections() {
    let nodeIDFire = ENState.currentEditNodeID

    let node = ENState.nodes.find((e) => e._fid === nodeIDFire)
    if (node) {
      let nodeID = node.data._id

      let connIDs = ENState.connections
        .filter((conn) => {
          if (conn.data.input.nodeID === nodeID) {
            return true
          }
          if (conn.data.output.nodeID === nodeID) {
            return true
          }
        })
        .map((e) => e._fid)

      connIDs.forEach((id) => {
        ENMethods.removeLinkByID({ linkID: id })
      })

      ENMethods.removeCodeBlockByID({
        nodeID: nodeIDFire,
      })

      ENState.currentEditNodeID = false
    }
  }
}

//
