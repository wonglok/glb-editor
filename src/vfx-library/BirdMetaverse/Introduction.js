import { createRoot } from 'react-dom/client'
import { useEffect, useRef } from 'react'

export class Introduction {
  constructor({ api, container, children }) {
    let getSVGBG = (svg) => {
      let headerSVG = `data:image/svg+xml;utf8,`
      svg = svg.replace(/\n/, '')
      svg = svg.trim()
      return `${headerSVG}${encodeURIComponent(svg)}`
    }

    //
    api.now.links = []
    api.now.loaded = 0
    api.now.total = api.now.links.length || 1
    api.now.loadingState = 'loading-map'
    api.now.overlay = 'welcome'

    let div = document.createElement('div')

    let root = createRoot(div)
    root.render(<GUILayers api={api} />)

    //
    container.appendChild(div)
    api.onClean(() => {
      container.removeChild(div)
    })
    //
  }
}

function GUILayers({ api }) {
  let refMobile = useRef()
  let refDesk = useRef()
  api.reactTo('overlay')
  api.reactTo('loadingState')

  useEffect(() => {
    async function init() {
      if (refDesk.current && refMobile.current) {
        if ('ontouchstart' in window) {
          refDesk.current.style.display = 'hidden'
          refMobile.current.style.display = 'block'
        } else {
          refDesk.current.style.display = 'block'
          refMobile.current.style.display = 'hidden'
        }
      }
    }
    init()
  }, [])
  return (
    <>
      {api.now.overlay === 'welcome' && (
        <div
          className='absolute flex items-center justify-center'
          style={{
            top: `calc(30% - 300px / 2)`,
            left: `calc(50% - 300px / 2)`,
            width: '300px',
            minHeight: `300px`,
            borderRadius: `30px`,
            backgroundColor: 'white',
            textAlign: `center`,
            backgroundColor: `rgba(0,0,0,0.5)`,
            color: 'white',
          }}
        >
          <div>
            <div className='py-5 text-2xl'> Welcome To Metaverse! </div>
            <div className='text'>
              <img
                src={'/Metaverse/logo/mobile-use.png'}
                className='hidden p-3 instruction'
                alt='mobilbe'
                ref={refMobile}
              />
              <img
                className='hidden'
                alt='desktop instruction p-3'
                src={'/Metaverse/logo/desktop-use.png'}
                ref={refDesk}
              />
            </div>

            {api.now.loadingState === 'loading-map' && (
              <div className='inline-block p-3 px-6 mx-3 my-5 border border-white cursor-pointer rounded-xl hover:bg-white hover:bg-opacity-70'>
                {`Loading...`}
              </div>
            )}

            {api.now.loadingState === 'ready' && (
              <div
                className='inline-block p-3 px-6 mx-3 my-5 border border-white cursor-pointer rounded-xl hover:bg-white hover:bg-opacity-70'
                onClick={() => {
                  api.now.overlay = ''
                }}
              >
                {`Let's Go!`}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
