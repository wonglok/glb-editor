import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { Object3D, Vector3 } from 'three140'
import { Core } from '@/vfx-core/Core'
import { EventEmitter, getID } from '@/vfx-runtime/ENUtils'
import { useENEditor } from '@/vfx-studio/store/use-en-editor'
import { ENTJCore } from '../ENTJCore/ENTJCore'
import { EffectNodeObjectLink } from './EffectNodeObjectLink'
import { EffectNodeObjectNode } from './EffectNodeObjectNode'
import { useAccessor } from '@/vfx-studio/store/use-accessor'

export function EffectNodeObject({
  glbObject,
  item,
  effectNode,
  disabledNodes,
}) {
  //
  let [enRuntime, setEnRuntime] = useState()

  //
  let reloadGraphID = useENEditor((s) => s.reloadGraphID)
  useENEditor((s) => s.overlay)
  useAccessor((s) => s.selectedMeshes)

  //
  let get = useThree((s) => s.get)

  //
  useEffect(() => {
    item.geometry?.computeBoundingSphere()
    // let center = item.geometry.boundingSphere.center
    // // let radius = item.geometry.boundingSphere.radius

    // //
    // let next = new Vector3()

    let mounter = new Object3D()
    // mounter.position.copy(next)
    let enRuntime = new ENTJCore({ name: item.name + getID() })
    enRuntime.now.eventsBus = new EventEmitter()
    Core.now.canvas = enRuntime

    let st = get()

    for (let kn in st) {
      enRuntime.now[kn] = st[kn]
    }
    enRuntime.now.mounter = mounter
    enRuntime.now.itself = item
    enRuntime.now.glbObject = glbObject

    //
    enRuntime.onLoop(() => {
      item.getWorldPosition(mounter.position)
      item.getWorldQuaternion(mounter.quaternion)
      item.getWorldScale(mounter.scale)

      // glbObject.scene.updateMatrixWorld(true)
      // item.getWorldPosition(mounter.position)

      //
      // console.log(item)
    })

    st.scene.add(mounter)

    setEnRuntime(enRuntime)

    return () => {
      if (enRuntime) {
        enRuntime.clean()
      }
    }
  }, [get, glbObject, item])

  useFrame(() => {
    enRuntime?.work()
  })
  //

  let on = (ev, h) => {
    enRuntime.now.eventsBus.addEventListener(ev, h)
    return () => {
      enRuntime.now.eventsBus.removeEventListener(ev, h)
    }
  }
  let emit = (ev, data) => {
    enRuntime.now.eventsBus.trigger(ev, data)
  }

  return (
    <>
      {enRuntime && (
        <>
          <group>
            {effectNode &&
              effectNode.nodes &&
              effectNode.nodes.map((node) => {
                return (
                  <EffectNodeObjectNode
                    key={
                      node._id +
                      reloadGraphID +
                      enRuntime.name +
                      effectNode.connections.map((e) => e._id)
                    }
                    disabledNodes={disabledNodes}
                    node={node}
                    glbObject={glbObject}
                    mounter={item}
                    on={on}
                    emit={emit}
                    effectNode={effectNode}
                    enRuntime={enRuntime}
                  ></EffectNodeObjectNode>
                )
              })}

            {/*  */}
            {effectNode?.connections &&
              effectNode.connections.map((conn) => {
                return (
                  <EffectNodeObjectLink
                    key={
                      conn._id +
                      reloadGraphID +
                      enRuntime.name +
                      effectNode.connections.map((e) => e._id)
                    }
                    link={conn}
                    allLinks={effectNode.connections}
                    on={on}
                    emit={emit}
                    enRuntime={enRuntime}
                  ></EffectNodeObjectLink>
                )
              })}
          </group>
        </>
      )}
    </>
  )
}

// export class EN2Runtime {
//   //
//   constructor({ json, codes }) {
//     this.events = new EventEmitter()

//     // let codes = getCodes();

//     this.json = json

//     if (!codes) {
//       codes = getCodes()
//     }
//     this.codes = codes

//     this.mini = Core.makeDisposableNode({ name: 'enruntime' }).sub

//     this.clean = () => {
//       this.mini.clean()
//     }

//     let on = (ev, h) => {
//       this.events.addEventListener(ev, h)
//       this.mini.onClean(() => {
//         this.events.removeEventListener(ev, h)
//       })
//     }
//     let emit = (ev, data) => {
//       this.events.trigger(ev, data)
//     }

//     this.json.connections.forEach((conn) => {
//       on(conn.data.output._id, (data) => {
//         emit(conn.data.input._id, data)
//       })
//     })

//     // let queue = []
//     let promiseList = this.json.nodes.map((node) => {
//       let title = node.data.title

//       this.mini.set(node._fid, node.data)

//       let featureModule = codes.find((e) => e.title === title)

//       // let mode = "queue";
//       // this.mini.ready["all-ready"].then(() => {
//       //   mode = "can-send";
//       //   queue.forEach((ev) => {
//       //     emit(ev.event, ev.data);
//       //   });
//       //   //
//       //   // comments.log(ev);
//       // });
//       // if (mode === "can-send") {
//       // } else {
//       //   queue.push({
//       //     event: output._id,
//       //     data,
//       //   });
//       // }

//       let portsAPIMap = new Map()

//       let inputs = node.data.inputs
//       let outputs = node.data.outputs

//       //
//       // portsAPIMap.set(`in${idx}`, {
//       // });

//       let vm = this
//       inputs.forEach((input, idx) => {
//         let answer = false

//         //
//         let api = {
//           stream: (onReceive) => {
//             on(input._id, onReceive)
//           },
//           get ready() {
//             return new Promise((resolve) => {
//               let tt = setInterval(() => {
//                 if (answer) {
//                   clearInterval(tt)
//                   resolve(answer)
//                 }
//               }, 0)
//             })
//           },
//         }

//         on(input._id, (v) => {
//           answer = v
//         })

//         portsAPIMap.set(`in${idx}`, api)
//       })

//       outputs.forEach((output, idx) => {
//         portsAPIMap.set(`out${idx}`, {
//           pulse: (data) => {
//             emit(output._id, data)
//           },
//         })
//       })

//       let nodeAPI = new Proxy(node, {
//         get: (obj, key) => {
//           //
//           if (key.indexOf('in') === 0 && !isNaN(key[2])) {
//             return portsAPIMap.get(key)
//           }

//           if (key.indexOf('out') === 0 && !isNaN(key[3])) {
//             return portsAPIMap.get(key)
//           }

//           if (obj[key]) {
//             return obj[key]
//           }
//           //
//         },
//       })

//       //

//       let dataAPI = new Proxy(
//         {},
//         {
//           get: (obj, accessKey) => {
//             if (
//               //
//               accessKey === 'shaders' ||
//               accessKey === 'materials' ||
//               accessKey === 'uniforms'
//             ) {
//               //
//               return new Proxy(
//                 {},
//                 {
//                   get: (obj, entryName) => {
//                     return (hander) => {
//                       this.mini.onClean(
//                         this.mini.onChange(
//                           node._fid,
//                           (nodeData) => {
//                             //
//                             let arr = nodeData[accessKey] || []
//                             let founds = arr.filter((m) => m.name === entryName)

//                             founds.forEach((found) => {
//                               if (found) {
//                                 hander(found)
//                               }
//                             })

//                             if (founds.length > 1) {
//                               console.log('duplicated item detected', entryName)
//                             }
//                           },
//                           {
//                             initFire: true,
//                           }
//                         )
//                       )
//                     }
//                   },
//                 }
//               )
//             }
//             //
//           },
//         }
//       )

//       ///

//       if (featureModule) {
//         return featureModule
//           .loader()
//           .then(async (logic) => {
//             return await logic.effect({
//               mini: this.mini,
//               node: nodeAPI,
//               data: dataAPI,
//             })
//           })
//           .catch((err) => {
//             console.error(err)
//           })

//         //
//       } else {
//         return Promise.resolve()
//       }
//     })

//     this.mini.set('done', true)

//     // .forEach()
//     // this.ports = new ENPorts({ mini, json });
//   }
// }
