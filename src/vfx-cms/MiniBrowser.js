import { useEffect, useState } from 'react'

const { ENState } = require('./ENState')

export function MiniBrowser({ graphID }) {
  ENState.makeKeyReactive('reloadBrowser')

  let url = `/devcms?graphID=${encodeURIComponent(graphID)}`
  // let [url, setURL] = useState(`/devcms${graphID ? `/${graphID}` : ''}`)

  // useEffect(() => {
  //   let browserURL = localStorage?.getItem('minibrowser' + graphID)
  //   if (
  //     typeof browserURL === 'string' &&
  //     browserURL !== '' &&
  //     browserURL !== 'false' &&
  //     browserURL !== 'null'
  //   ) {
  //     setURL(browserURL || `/devcms${graphID ? `/${graphID}` : ''}`)
  //   }
  //   //
  //   //
  // }, [])
  return (
    <div className='flex flex-col w-full h-full'>
      <div className='bg-gray-100 flex' style={{ height: '60px' }}>
        <button
          className='p-3'
          onClick={() => {
            //

            ENState.reloadBrowser++
            // localStorage?.setItem('minibrowser' + graphID, url)
          }}
        >
          Reload
        </button>
        <button
          className='p-3'
          onClick={() => {
            //
            window.open(url)
          }}
        >
          Open
        </button>
        <input
          type={'text'}
          className={'w-full p-3'}
          defaultValue={url}
          onBlur={(ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            // let url = ev.target.value

            // setURL(url)
            // localStorage?.setItem('minibrowser' + graphID, url)
            ENState.reloadBrowser++
            // ENState.reloadBrowser++
          }}
          // onChange={(ev) => {

          // }}
          onKeyDown={(ev) => {
            //
            if (ev.key === 'Enter') {
              ev.preventDefault()
              ev.stopPropagation()
              // let url = ev.target.value

              // setURL(url)
              // localStorage?.setItem('minibrowser' + graphID, url)
              ENState.reloadBrowser++
            }
          }}
        ></input>
      </div>
      <iframe
        key={ENState.reloadBrowser + '' + url}
        className={'w-full'}
        style={{ height: `calc(100% - 60px)` }}
        src={url}
      ></iframe>
    </div>
  )
}
