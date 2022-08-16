import { useState } from 'react'
import { useENEditor } from '@/vfx-studio/store/use-en-editor'

export function NodesAdd() {
  let setOverlay = useENEditor((s) => s.setOverlay)
  let overlay = useENEditor((s) => s.overlay)
  let codes = useENEditor((s) => s.codes)

  let [str, setStr] = useState('')

  let selectCodeToAdd = useENEditor((s) => s.selectCodeToAdd)
  let addCode = ({ codeID }) => {
    selectCodeToAdd({ codeID })
    setOverlay(false)
  }

  return (
    <>
      {overlay === 'add' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: `calc(0% )`,
              left: `calc(0% )`,
              width: `100%`,
              height: `100%`,
            }}
            className='shadow-xl backdrop-blur-lg rounded-xl'
            onClick={() => {
              setOverlay(false)
            }}
          >
            {/*  */}
          </div>
          {/*  */}
          <div
            style={{
              position: 'absolute',
              top: `calc(50% - 400px / 2)`,
              left: `calc(50% - 500px / 2)`,
              width: `500px`,
              height: `400px`,
              overflow: 'scroll',
            }}
            className='bg-yellow-400 border border-yellow-500 shadow-xl rounded-xl'
          >
            <div className='p-2 text-xl text-center bg-yellow-300 border-b border-yellow-500 rounded-t-xl'>
              Please Select a Node
            </div>
            <textarea
              rows={1}
              autoFocus={true}
              defaultValue={str}
              onKeyDownCapture={(ev) => {
                ev.stopPropagation()
              }}
              onInput={(ev) => {
                if (ev.key === 'Enter') {
                  ev.preventDefault()
                  //
                  let firstCode = codes.filter((it) => {
                    return (it.title || '').indexOf(str) !== -1
                  })[0]
                  if (firstCode) {
                    addCode({ codeID: firstCode.title })
                  }
                } else {
                  setStr(ev.target.value || '')
                }
              }}
              className='w-full p-2 -mb-2 bg-white border-b border-yellow-500 cursor-pointer hover:bg-yellow-100'
            ></textarea>

            {codes &&
              codes
                .filter((it) => {
                  return (it.title || '').indexOf(str) !== -1
                })
                .map((code, idx) => {
                  return idx === 0 ? (
                    <div
                      onClick={() => {
                        addCode({ codeID: code.title })
                      }}
                      key={code.key}
                      className='p-2 bg-white border-b border-yellow-500 cursor-pointer hover:bg-yellow-100'
                    >
                      {code.title}
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        addCode({ codeID: code.title })
                      }}
                      key={code.key}
                      className='p-2 bg-yellow-200 border-b border-yellow-500 cursor-pointer hover:bg-yellow-100'
                    >
                      {code.title}
                    </div>
                  )
                })}
          </div>
          <div
            style={{
              position: 'absolute',
              top: `calc(50% - 400px / 2 - 30px)`,
              right: `calc(50% - 500px / 2 - 30px) `,
              width: `50px`,
              height: `50px`,
              borderRadius: '100%',
            }}
            className='text-white bg-red-500 shadow-xl cursor-pointer rounded-xl'
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
        </>
      )}
    </>
  )
}
