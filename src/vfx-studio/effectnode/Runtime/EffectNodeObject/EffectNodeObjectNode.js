import { useEffect } from 'react'
import { useENEditor } from '@/vfx-studio/store/use-en-editor'

export function EffectNodeObjectNode({
  mini,
  effectNode,
  mounter,
  glbObject,
  on,
  emit,
  node,
  enRuntime,
}) {
  let codes = useENEditor((s) => s.codes)
  useEffect(() => {
    let cleans = []
    let featureModule = codes.find((e) => e.title === node.codeID)

    if (featureModule) {
      featureModule.loader().then(async (logic) => {
        enRuntime.set(node._id, node)

        // let mode = 'queue'
        // enRuntime.ready['all-ready'].then(() => {
        //   mode = 'can-send'
        //   queue.forEach((ev) => {
        //     emit(ev.event, ev.data)
        //   })
        //   //
        //   // comments.log(ev);
        // })
        // if (mode === 'can-send') {
        // } else {
        //   queue.push({
        //     event: output._id,
        //     data,
        //   })
        // }

        let portsAPIMap = new Map()

        let inputs = node.inputs || []
        let outputs = node.outputs || []

        //
        // portsAPIMap.set(`in${idx}`, {
        // });

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
            if (key === 'data') {
              return node
            }

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
                        enRuntime.onClean(
                          enRuntime.onChange(
                            node._id,
                            (nodeData) => {
                              //
                              let arr = nodeData[accessKey] || []
                              let founds = arr.filter(
                                (m) => m.name === entryName
                              )

                              founds.forEach((found) => {
                                if (found) {
                                  hander(found)
                                }
                              })

                              if (founds.length > 1) {
                                console.log(
                                  'duplicated item detected',
                                  entryName
                                )
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

        let mini = enRuntime.makeDisposableNode({ name: node.displayTitle })

        cleans.push(() => {
          mini.clean()
        })

        //
        return await logic
          .effect({
            mini,
            node: nodeAPI,
            data: dataAPI,
          })
          ?.catch((e) => {
            console.log(e)
          })
      })
    }

    return () => {
      cleans.forEach((c) => c())
    }
  }, [])
  return <></>
}