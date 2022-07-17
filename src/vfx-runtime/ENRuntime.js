import { onReady } from '../vfx-cms/firebase'
import { Core } from '../vfx-core/Core'
// import { logger } from 'ethers'
// import { ENMini } from './ENMini'
import { EventEmitter } from './ENUtils'

export function getCodes() {
  let path = require('path')
  let r = require.context('../vfx-nodes', true, /\.en\.js$/, 'lazy')

  function importAll(r) {
    let arr = []

    r.keys().forEach((key) => {
      let filename = path.basename(key)
      filename = filename.replace('.en.js', '')

      arr.push({
        title: filename,
        key,
        path: `../vfx-nodes/${path.basename(key)}`,
        loader: () => r(key),
      })
    })

    console.log(arr)

    return arr
  }

  return importAll(r)
}

//
export class ENRuntime {
  //
  constructor({ json, codes }) {
    this.events = new EventEmitter()

    // let codes = getCodes();

    this.json = json

    if (!codes) {
      codes = getCodes()
    }
    this.codes = codes

    this.mini = Core.makeDisposableNode({ name: 'enruntime' }).sub

    this.clean = () => {
      this.mini.clean()
    }

    let on = (ev, h) => {
      this.events.addEventListener(ev, h)
      this.mini.onClean(() => {
        this.events.removeEventListener(ev, h)
      })
    }
    let emit = (ev, data) => {
      this.events.trigger(ev, data)
    }

    this.json.connections.forEach((conn) => {
      on(conn.data.output._id, (data) => {
        emit(conn.data.input._id, data)
      })
    })

    if (json.graphID) {
      onReady().then(({ db }) => {
        db.ref(`/canvas/${json.graphID}`).once('value', (snap) => {
          if (snap) {
            let val = snap.val()

            let ownerID = Object.keys(val)[0]
            let graphData = Object.values(val)[0]

            let connections = []
            for (let kn in graphData.connections) {
              connections.push({
                _fid: kn,
                data: graphData.connections[kn],
              })
            }

            let nodes = []
            for (let kn in graphData.nodes) {
              nodes.push({
                _fid: kn,
                data: graphData.nodes[kn],
              })
            }

            nodes.forEach((node) => {
              //

              this.mini.onClean(
                db
                  .ref(`/canvas/${json.graphID}/${ownerID}/nodes/${node._fid}`)
                  .on(`value`, (snap) => {
                    //
                    if (snap) {
                      let value = snap.val()

                      if (value) {
                        this.mini.set(node._fid, value)
                      }
                    }
                  })
              )
            })
          }
        })
      })
    }

    // let queue = []
    let promiseList = this.json.nodes.map((node) => {
      let title = node.data.title

      this.mini.set(node._fid, node.data)

      let featureModule = codes.find((e) => e.title === title)

      // let mode = "queue";
      // this.mini.ready["all-ready"].then(() => {
      //   mode = "can-send";
      //   queue.forEach((ev) => {
      //     emit(ev.event, ev.data);
      //   });
      //   //
      //   // comments.log(ev);
      // });
      // if (mode === "can-send") {
      // } else {
      //   queue.push({
      //     event: output._id,
      //     data,
      //   });
      // }

      let portsAPIMap = new Map()

      let inputs = node.data.inputs
      let outputs = node.data.outputs

      //
      // portsAPIMap.set(`in${idx}`, {
      // });

      let vm = this
      inputs.forEach((input, idx) => {
        let answer = false

        //
        let api = {
          stream: (onReceive) => {
            on(input._id, onReceive)
          },
          get ready() {
            return new Promise((resolve) => {
              let tt = setInterval(() => {
                if (answer) {
                  clearInterval(tt)
                  resolve(answer)
                }
              }, 0)
            })
          },
        }

        on(input._id, (v) => {
          answer = v
        })

        portsAPIMap.set(`in${idx}`, api)
      })

      outputs.forEach((output, idx) => {
        portsAPIMap.set(`out${idx}`, {
          pulse: (data) => {
            emit(output._id, data)
          },
        })
      })

      let nodeAPI = new Proxy(node, {
        get: (obj, key) => {
          //
          if (key.indexOf('in') === 0 && !isNaN(key[2])) {
            return portsAPIMap.get(key)
          }

          if (key.indexOf('out') === 0 && !isNaN(key[3])) {
            return portsAPIMap.get(key)
          }

          if (obj[key]) {
            return obj[key]
          }
          //
        },
      })

      //

      let dataAPI = new Proxy(
        {},
        {
          get: (obj, accessKey) => {
            if (
              //
              accessKey === 'shaders' ||
              accessKey === 'materials' ||
              accessKey === 'uniforms'
            ) {
              //
              return new Proxy(
                {},
                {
                  get: (obj, entryName) => {
                    return (hander) => {
                      this.mini.onClean(
                        this.mini.onChange(
                          node._fid,
                          (nodeData) => {
                            //
                            let arr = nodeData[accessKey] || []
                            let founds = arr.filter((m) => m.name === entryName)

                            founds.forEach((found) => {
                              if (found) {
                                hander(found)
                              }
                            })

                            if (founds.length > 1) {
                              console.log('duplicated item detected', entryName)
                            }
                          },
                          {
                            initFire: true,
                          }
                        )
                      )
                    }
                  },
                }
              )
            }
            //
          },
        }
      )

      ///

      if (featureModule) {
        return featureModule
          .loader()
          .then(async (logic) => {
            return await logic.effect({
              mini: this.mini,
              node: nodeAPI,
              data: dataAPI,
            })
          })
          .catch((err) => {
            console.error(err)
          })

        //
      } else {
        return Promise.resolve()
      }
    })

    this.mini.set('done', true)

    // .forEach()
    // this.ports = new ENPorts({ mini, json });
  }
}
