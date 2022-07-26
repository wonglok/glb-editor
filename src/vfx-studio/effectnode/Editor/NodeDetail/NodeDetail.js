import { useEffect } from 'react'
import { useENEditor } from 'vfx-studio/store/use-en-editor'

export function NodeDetail() {
  let setOverlay = useENEditor((s) => s.setOverlay)
  let overlay = useENEditor((s) => s.overlay)
  let getActiveNode = useENEditor((s) => s.getActiveNode)
  let getEffectNode = useENEditor((s) => s.getEffectNode)
  let reloadGraphID = useENEditor((s) => s.reloadGraphID)
  let removeLink = useENEditor((s) => s.removeLink)
  let removeNode = useENEditor((s) => s.removeNode)
  let setActiveNodeID = useENEditor((s) => s.setActiveNodeID)
  let effectNode = getEffectNode()
  let node = getActiveNode()

  useEffect(() => {
    let hh = (ev) => {
      if (ev.key === 'Escape') {
        if (overlay === 'nodeDetail') {
          setOverlay('')
        }
      }
    }
    window.addEventListener('keydown', hh)
    return () => {
      window.removeEventListener('keydown', hh)
    }

    //
  }, [overlay])

  return (
    <>
      {overlay === 'nodeDetail' && node && (
        <>
          <span id={reloadGraphID}></span>
          <div
            style={{
              position: 'absolute',
              top: `calc(0% )`,
              left: `calc(0% )`,
              width: `100%`,
              height: `100%`,
            }}
            className='  backdrop-blur-lg shadow-xl'
            onClick={() => {
              setOverlay(false)
            }}
          >
            {/*  */}
            {/*  */}
            {/*  */}
          </div>

          <div
            style={{
              position: 'absolute',
              top: `calc(50% - 85% / 2)`,
              left: `calc(50% - 85% / 2)`,
              width: `85%`,
              height: `85%`,
              overflow: 'scroll',
            }}
            //
            className='bg-white border border-yellow-300 bg-opacity-40 rounded-xl shadow-xl'
          >
            <div className='text-center py-2 bg-yellow-400'>
              {node.displayTitle}
            </div>

            <div>
              <div className='p-2'>This node</div>
              <div className='p-2'>
                <div key={node._id}>
                  {/*  */}
                  {/*  */}
                  {/*  */}

                  <button
                    onClick={() => {
                      //
                      removeNode(node)
                      // effectNode.connections

                      effectNode.connections
                        .filter((it) => {
                          return (
                            it.input.nodeID === node._id ||
                            it.output.nodeID === node._id
                          )
                        })
                        .forEach((conn) => {
                          removeLink(conn)
                        })
                      setActiveNodeID('')
                      setOverlay('')
                      //
                    }}
                  >
                    {node._id}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className='p-2'>Connections</div>
              <div className='p-2'>
                {effectNode.connections.map((conn) => {
                  return (
                    <div key={conn._id}>
                      {/*  */}
                      {/*  */}
                      {/*  */}

                      <button
                        onClick={() => {
                          //
                          removeLink(conn)
                          //
                        }}
                      >
                        {conn._id}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/*  */}
          {/*  */}
          {/*  */}
          <div
            style={{
              position: 'absolute',
              top: `calc(50% - 85% / 2 - 50px / 2)`,
              right: `calc(50% - 85% / 2 - 50px / 2)`,
              width: `50px`,
              height: `50px`,
              borderRadius: '100%',
            }}
            className='bg-red-500 text-white rounded-xl shadow-xl cursor-pointer'
            onClick={() => {
              setOverlay(false)
            }}
          >
            <svg
              clipRule='evenodd'
              fillRule='evenodd'
              strokeLinejoin='round'
              strokeMiterlimit='2'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
              className=' scale-75'
            >
              <path
                fill='white'
                d='m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z'
              />
            </svg>
          </div>
          {/*  */}
          {/*  */}
          {/*  */}
        </>
      )}
    </>
  )
}
