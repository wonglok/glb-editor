import { useEffect, useMemo, useRef, useState } from 'react'
import { ENMethods, ENState } from './ENState'
import path from 'path'
import { ENMaterialsTab } from './ENMaterialsTab'
import { ENShaderTab } from './ENShaderTab'
import { ENUniformsTab } from './ENUniformsTab'

//
export function ENHtml() {
  ENState.makeKeyReactive('overlay')

  useEffect(() => {
    let h = (e) => {
      if (e.key.toLowerCase() === 'escape') {
        ENState.overlay = ''
      }
    }

    //

    window.addEventListener('keydown', h)
    return () => {
      window.removeEventListener('keydown', h)
    }
  }, [])

  //
  //
  useEffect(() => {
    let h = (e) => {
      if (ENState.overlay === '') {
        if (e.metaKey && e.key === 'f') {
          ENState.overlay = 'main'
          e.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', h)
    return () => {
      window.removeEventListener('keydown', h)
    }
  }, [])

  return (
    <>
      {/*  */}
      {ENState.overlay === 'main' && <MainPanel></MainPanel>}
      {ENState.overlay === 'node' && <NodePanel></NodePanel>}
      {ENState.overlay === 'addCodeBlock' && (
        <div className='absolute top-0 left-0 w-full bg-white bg-opacity-95'>
          <div className='bg-green-400'>
            <div className='p-3 font-serif text-2xl'>
              <div className='text-white select-none'>
                Click on Floor to Add
              </div>
            </div>
          </div>
        </div>
      )}

      {ENState.overlay && (
        <div className='absolute top-0 right-0 p-4'>
          <svg
            width='24'
            height='24'
            xmlns='http://www.w3.org/2000/svg'
            fillRule='evenodd'
            clipRule='evenodd'
            fill='white'
            onClick={() => {
              ENState.overlay = ''
            }}
            onPointerDown={() => {
              ENState.overlay = ''
            }}
            className=' cursor-pointer'
          >
            <path d='M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z' />
          </svg>
        </div>
      )}
    </>
  )
}

export let useNodes = () => {
  let [nodesTemplates, setNodes] = useState([])
  useEffect(() => {
    //
    let r = require.context('../vfx-nodes/', true, /\.en\.js$/, 'lazy')

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

      setNodes(arr)
    }

    importAll(r)
  }, [])

  return nodesTemplates
}

function MainPanel() {
  let nodesTemplates = useNodes()
  let [query, setQuery] = useState('')

  useEffect(() => {
    let h = (e) => {
      if (ENState.overlay === 'main') {
        if (e.key.toLowerCase() === 'enter') {
          //
          //

          let arr = nodesTemplates.filter((e) => {
            //
            if (query) {
              if (e.title.includes(query)) {
                return true
              } else {
                return false
              }
            }

            return true
          })

          let obj = arr[0]

          // nodeData

          if (obj) {
            ENState.addNodeTitle = obj.title
            ENState.hovering = 'floor'
            ENState.cursorMode = 'addCodeBlock'
            ENState.overlay = 'addCodeBlock'
          }
        }
        // console.log(e.key.toLowerCase() === 'enter')
      }
    }

    window.addEventListener('keydown', h)
    return () => {
      window.removeEventListener('keydown', h)
    }
  }, [query, nodesTemplates])

  // w-full h-full absolute top-0 left-0
  return (
    <>
      <div
        className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-25'
        onClick={() => {
          //
          ENState.overlay = ''
        }}
      ></div>
      <div
        className='bg-white shadow-xl bg-opacity-95 rounded-b-2xl rounded-2xl'
        style={{
          position: 'absolute',
          top: `calc(100% / 2 - 550px / 2 - 5%)`,
          left: `calc(100% / 2 - 750px / 2)`,
          height: `550px`,
          width: `750px`,
          overflowY: 'scroll',
        }}
      >
        {/*  */}
        <style jsx>
          {`
            #place::placeholder {
              color: white;
            }
          `}
        </style>
        <input
          type={'text'}
          id={'place'}
          placeholder='Search Node'
          className='flex items-center w-full p-3 font-serif text-2xl text-white placeholder-white bg-yellow-400 outline-none rounded-t-2xl'
          rows={1}
          //
          autoFocus
          //
          onInput={(ev) => {
            setQuery(ev.target.value || '')
          }}
          //
          onChange={(ev) => {
            setQuery(ev.target.value || '')
          }}
        >
          {/* <div className='text-white select-none'>Getting Started</div> */}
        </input>

        {/* <div className='p-3 text-xl font-serif '>
        <div className=''>Add New CodeBlock</div>
      </div> */}

        {nodesTemplates
          .filter((e) => {
            //
            if (query) {
              if (e.title.includes(query)) {
                return true
              } else {
                return false
              }
            }

            return true
          })
          .map((e, i) => {
            return (
              <div
                key={e.key}
                className={
                  ' p-3 text underline ' +
                  `${
                    i === 0
                      ? 'bg-yellow-300'
                      : i % 2 === 0
                      ? 'bg-gray-200'
                      : 'bg-gray-100'
                  }`
                }
              >
                <div
                  className=' cursor-pointer'
                  onPointerDown={() => {
                    ENState.addNodeTitle = e.title
                    ENState.hovering = 'floor'
                    ENState.cursorMode = 'addCodeBlock'
                    ENState.overlay = 'addCodeBlock'
                  }}
                >
                  {e.title}
                </div>
              </div>
            )
          })}

        {/* <div className="p-3 text font-serif underline">
        <div
          className=" cursor-pointer"
          onPointerDown={() => {
            ENState.addNodeTitle = "mytitle";
            ENState.hovering = "floor";
            ENState.cursorMode = "addCodeBlock";
            ENState.overlay = "addCodeBlock";
          }}
        >
          Add New CodeBlock
        </div>
      </div> */}
      </div>
    </>
  )
}

function NodeAndLinks() {
  let nodesTemplates = useNodes()

  useEffect(() => {
    //
    let h = (e) => {
      if (ENState.overlay === 'node') {
        if (e.key.toLowerCase() === 'x') {
          if (window.confirm(`remove item`)) {
            ENMethods.removeCurrentNodeAndConnections()
            ENState.overlay = ''
          }
        }
      }
    }

    window.addEventListener('keydown', h)
    return () => {
      window.removeEventListener('keydown', h)
    }
  }, [])

  let { node, outputLinks, inputLinks } = useMemo(() => {
    let fireNodeID = ENState.currentEditNodeID
    let node = ENState.nodes.find((e) => e._fid === fireNodeID)
    let inputLinks = []
    let outputLinks = []

    if (node) {
      let nodeID = node.data._id

      inputLinks = ENState.connections.filter((conn) => {
        if (conn.data.input.nodeID === nodeID) {
          return true
        }
      })

      outputLinks = ENState.connections.filter((conn) => {
        if (conn.data.output.nodeID === nodeID) {
          return true
        }
      })
    }

    return {
      node,
      inputLinks,
      outputLinks,
    }
  })

  let [, reload] = useState(0)
  let [title, setTitle] = useState(node.data.title)

  return (
    <>
      {/*  */}
      {/*  */}
      {/*  */}

      <div className='p-3 font-serif text-xl'>
        <div className='text-2xl cursor-pointer'>Choose Logic</div>
      </div>

      <div className='p-3 font-serif text-xl'>
        <div className=''>
          <div className='inline-block border-b border-black'>
            <select
              value={title}
              onChange={({ target: { value } }) => {
                node.data.title = value
                ENMethods.saveCodeBlock({ node })
                setTitle(value)
              }}
            >
              {nodesTemplates.map((t, i) => {
                return (
                  <option key={i + t.title} value={t.title}>
                    {t.title}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </div>

      <div className='p-3 font-serif text-xl'>
        <div className='text-2xl cursor-pointer'>Edit Connections</div>
      </div>

      {inputLinks.length > 0 && (
        <div className='p-3 font-serif text-xl'>
          <div className=' cursor-pointer'>Inputs</div>
        </div>
      )}

      {inputLinks.map((e) => {
        let localID = e.data.input._id
        let idx = node.data.inputs.findIndex((e) => e._id === localID)

        let socket = node.data.inputs.find((e) => e._id === localID)
        let remoteNode = ENState.nodes.find((e) => e.data._id === socket.nodeID)
        return (
          <div key={e._fid} className='mb-3 ml-3 underline text'>
            <div
              className=' cursor-pointer'
              onPointerDown={(ev) => {
                if (ev.currentTarget.style.color === 'red') {
                  //
                  ENMethods.removeLinkByID({ linkID: e._fid })
                  reload((s) => s + 1)
                }
                ev.currentTarget.style.color = 'red'
              }}
            >
              {/*  */}
              Remove Input at label "{idx}"{' '}
              {remoteNode.data.title && (
                <span>which is conncted to "{remoteNode.data.title}"</span>
              )}
            </div>
          </div>
        )
      })}

      {outputLinks.length > 0 && (
        <div className='p-3 font-serif text-xl'>
          <div className=' cursor-pointer'>Outputs</div>
        </div>
      )}

      {outputLinks.map((e) => {
        let localID = e.data.output._id
        let idx = node.data.outputs.findIndex((e) => e._id === localID)

        let socket = node.data.outputs.find((e) => e._id === localID)
        let remoteNode = ENState.nodes.find((e) => e.data._id === socket.nodeID)

        return (
          <div key={e._fid} className='mb-3 ml-3 underline text'>
            <div
              className=' cursor-pointer'
              onPointerDown={(ev) => {
                if (ev.currentTarget.style.color === 'red') {
                  ENMethods.removeLinkByID({ linkID: e._fid })
                  reload((s) => s + 1)
                }
                ev.currentTarget.style.color = 'red'
              }}
            >
              {/*  */}
              Remove Output at label "{idx}"{' '}
              {remoteNode.data.title && (
                <span>which is conncted to "{remoteNode.data.title}"</span>
              )}
            </div>
          </div>
        )
      })}

      <div className='p-3 font-serif text-xl'>
        <div className='text-2xl cursor-pointer'>Remove Node & Connections</div>
      </div>

      <div className='p-3  '>
        <div
          className='mb-3 underline cursor-pointer'
          onPointerDown={() => {
            if (window.confirm(`remove item`)) {
              ENMethods.removeCurrentNodeAndConnections()
              ENState.overlay = ''
            }
          }}
        >
          Remove
        </div>

        <div className='text-sm text-gray-500'>
          Shortcut: Press X on keyboard to Delete
        </div>
      </div>
    </>
  )
}

function NodePanel() {
  ENState.makeKeyReactive('overlayTab')

  useEffect(() => {
    // ENState.overlayTab = 'node'
  }, [])

  //
  return (
    <>
      <div
        className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-25'
        onClick={() => {
          //
          ENState.overlay = ''
        }}
      ></div>

      <div
        style={{
          position: 'absolute',
          top: `calc(100% / 2 - 550px / 2 - 5%)`,
          left: `calc(100% / 2 - 750px / 2)`,
          height: `550px`,
          width: `750px`,
          overflowY: 'scroll',
        }}
        className='w-full bg-white shadow-lg bg-opacity-95 rounded-2xl'
      >
        <div className='flex items-center justify-between w-full rounded-tl-2xl'>
          <div
            onClick={() => {
              ENState.overlayTab = 'node'
            }}
            className='w-1/2 h-full p-3 font-serif text-lg text-center bg-blue-400 cursor-pointer group'
          >
            <div className='h-full text-white select-none group-hover:opacity-40'>
              Connections
            </div>
          </div>

          {/* <div
            className={
              'bg-teal-500 p-3 text-lg font-serif text-center  h-full w-1/2 cursor-pointer group'
            }
          >
            <div
              className='h-full text-white select-none group-hover:opacity-40'
              onClick={() => {
                ENState.overlayTab = 'materials'
              }}
            >
              Materials
            </div>
          </div> */}

          <div
            className={
              'bg-purple-500 p-3 text-lg font-serif text-center  h-full w-1/2 cursor-pointer group'
            }
          >
            <div
              className='h-full text-white select-none group-hover:opacity-40'
              onClick={() => {
                ENState.overlayTab = 'uniforms'
              }}
            >
              Uniforms
            </div>
          </div>
          {/* <div
            className={
              'bg-green-500 p-3 text-lg font-serif text-center  h-full w-1/2 cursor-pointer group'
            }
          >
            <div
              className='h-full text-white select-none group-hover:opacity-40'
              onClick={() => {
                ENState.overlayTab = 'shader'
              }}
            >
              Shaders
            </div>
          </div> */}
        </div>

        {/*  */}
        {/*  */}
        {/*  */}
        <div className='w-full'>
          {ENState.overlayTab === 'node' && <NodeAndLinks></NodeAndLinks>}
          {ENState.overlayTab === 'materials' && (
            <ENMaterialsTab></ENMaterialsTab>
          )}

          {/*  */}
          {ENState.overlayTab === 'uniforms' && <ENUniformsTab></ENUniformsTab>}

          {ENState.overlayTab === 'ENUniformsTab' && (
            <ENUniformsTab></ENUniformsTab>
          )}

          {ENState.overlayTab === 'shader' && <ENShaderTab></ENShaderTab>}
        </div>
      </div>
    </>
  )
}
