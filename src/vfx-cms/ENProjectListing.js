import React, { useEffect, useRef, useState } from 'react'
import { ENState } from './ENState'
import { onReady } from './firebase'
import router from 'next/router'
import copy from 'copy-to-clipboard'
//

function RenameBox({ e }) {
  let ref = useRef()
  return (
    <>
      <textarea
        className='w-full h-full p-3 bg-gray-200 rounded-lg'
        defaultValue={e.data.title}
        ref={ref}
      >
        {/*  */}

        {/*  */}
      </textarea>
      <button
        className='w-full p-3 px-6 text-white bg-yellow-500 rounded-full'
        onClick={() => {
          //
          let newTitle = ref.current.value || 'no title'

          onReady().then(({ user, db }) => {
            if (newTitle) {
              newTitle = (newTitle || '').trim()

              let listingRef = db.ref(
                `profile/${user.uid}/canvas/${e._fid}/title`
              )
              listingRef.set(newTitle)

              e.data.title = newTitle

              ENState.listingReload++
            }
          })
        }}
      >
        Rename
      </button>
    </>
  )
}
export function ENProjectListing() {
  //
  ENState.makeKeyReactive('listing')
  ENState.makeKeyReactive('listingReload')

  useEffect(() => {
    onReady().then(({ user, db }) => {
      //
      //
      let listingRef = db.ref(`profile/${user.uid}/canvas`)

      let load = () => {
        listingRef.once('value', (snap) => {
          let val = snap.val()
          if (val) {
            let arr = []
            for (let kn in val) {
              arr.push({
                _fid: kn,
                data: val[kn],
              })
            }
            //

            ENState.listing = arr
          }
        })
      }

      load()
      ENState.onChange('listingReload', () => {
        load()
      })
    })
  }, [ENState.listingReload])

  //
  return (
    <div className='w-full py-1 overflow-x-auto'>
      <table>
        <thead>
          <tr>
            <th className='p-3 border  ' colSpan={1}>
              <span className='inline-block w-3'></span>CanvasID
              <span className='inline-block w-3'></span>
            </th>
            <th className='p-3 border  ' colSpan={1}>
              <span className='inline-block w-24'></span>Title
              <span className='inline-block w-24'></span>
            </th>
            <th className='p-3 border ' colSpan={5}>
              Actions
            </th>
            {/* <th>JSON</th> */}
          </tr>
        </thead>

        <tbody>
          {ENState.listing.map((e, idx) => {
            // console.log(e.data.shareACL)

            return (
              <React.Fragment key={e._fid}>
                <tr key={e._fid}>
                  <td className='p-3 m-3 bg-white border'>{e._fid}</td>
                  <td className='p-3 m-3 bg-white border'>
                    <RenameBox e={e}></RenameBox>
                  </td>
                  <td className='p-3 m-0 border'>
                    <button
                      className='p-3 px-6 text-white bg-blue-500 rounded-full'
                      onClick={() => {
                        //
                        router.push(
                          `/logic-cms/editor/${e.data.ownerID}/${e._fid}`
                        )
                      }}
                    >
                      Edit
                    </button>
                  </td>

                  <td className='p-3 m-0 border'>
                    <button
                      className='p-3 px-6 text-white bg-teal-500 rounded-full'
                      onClick={() => {
                        //
                        //
                        //

                        onReady().then(({ user, db }) => {
                          let dataRef = db.ref(`canvas/${e._fid}`)

                          //
                          dataRef.once('value', (data) => {
                            let myCanvasListing = db.ref(
                              `profile/${user.uid}/canvas`
                            )
                            let newItem = myCanvasListing.push()
                            newItem.set({
                              title:
                                e.data.title +
                                '-cloned-at-' +
                                new Date().getTime(),
                              ownerID: user.uid,
                              shareACL: JSON.parse(
                                JSON.stringify(e.data.shareACL)
                              ),
                            })

                            db.ref(`canvas/${newItem.key}/${user.uid}`).set(
                              data.val()[user.uid]
                            )

                            ENState.listingReload++
                          })
                        })
                      }}
                    >
                      Clone Project
                    </button>
                  </td>
                  <td className='p-3 m-0 border'>
                    <button
                      className='p-3 px-6 text-white bg-green-500 rounded-full'
                      onClick={() => {
                        //
                        copy(`
                      {/* ${e.data.title} */}
                      <ENLogicGraphAutoLoad graphID={"${e._fid}"} ></ENLogicGraphAutoLoad>`)
                      }}
                    >
                      Copy Code
                    </button>
                  </td>

                  <td className='p-3 border'>
                    <button
                      className='p-3 px-6 text-white bg-red-500 rounded-full'
                      onClick={() => {
                        //
                        //
                        onReady().then(({ user, db }) => {
                          let title = e.data.title || 'no title'
                          if (
                            (
                              window.prompt(
                                `Type "${title}" to Confirm Removal, theres no restore.`,
                                `${title} ______`
                              ) || ''
                            ).trim() === title
                          ) {
                            //
                            let listingRef = db.ref(
                              `profile/${user.uid}/canvas/${e._fid}`
                            )
                            listingRef.remove()

                            ENState.listing.splice(idx, 1)
                            ENState.listingReload++
                          }
                        })
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>

                <tr key={e._fid + '_share'}>
                  <td colSpan={2}></td>
                  <td colSpan={6} className={'border p-2'}>
                    <table className='w-full'>
                      <thead>
                        <tr>
                          <th className='p-3 border'>Project Collaborator</th>
                          <th className='p-3 border'>Nickname</th>
                          <th className='p-3 border' colSpan={2}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <thead>
                        <tr>
                          <td className='border'>
                            <textarea
                              id={'collaboratoruid' + e._fid}
                              placeholder='Collaborator UID'
                              className='w-full h-full p-3 '
                            ></textarea>
                          </td>
                          <td className='border'>
                            <textarea
                              id={'collaboratornote' + e._fid}
                              placeholder='Nick Name'
                              className='w-full h-full p-3 '
                            ></textarea>
                          </td>
                          <td className='text-center border' colSpan={2}>
                            <button
                              onClick={() => {
                                onReady().then(async ({ user, db }) => {
                                  let elA = document.querySelector(
                                    '#collaboratoruid' + e._fid
                                  )
                                  let elB = document.querySelector(
                                    '#collaboratornote' + e._fid
                                  )

                                  if (elA && elB) {
                                    let uidValue = elA.value
                                    let nicknameValue =
                                      elB.value || 'Project Collaborator'

                                    if (uidValue) {
                                      uidValue = (uidValue || '').trim()

                                      // Collaborator
                                      let refObj1 = db.ref(
                                        `profile/${user.uid}/canvas/${e._fid}/shareACL/${uidValue}`
                                      )
                                      // // Collaborator
                                      // let refObj2 = db.ref(
                                      //   `sharedWithMe/${uidValue}/${e._fid}`
                                      // )

                                      refObj1.set(nicknameValue).then(() => {
                                        // refObj2.set({
                                        //   owner: user.uid,
                                        //   canvas: e._fid,
                                        // })
                                      })

                                      e.data.shareACL[uidValue] = e._fid

                                      ENState.listingReload++

                                      elA.value = ''
                                      elB.value = ''
                                    }
                                  }
                                })
                              }}
                              className='p-3 px-6 text-white bg-blue-500 rounded-full'
                            >
                              Add CoEditors
                            </button>
                          </td>
                        </tr>
                        {e.data.shareACL &&
                          Object.keys(e.data.shareACL)
                            .filter((kn) => kn !== 'placeholder')
                            .map((kn, i) => {
                              return (
                                <tr key={kn + i}>
                                  <td className='p-3 border'>{kn}</td>
                                  <td className='p-3 border' colSpan={1}>
                                    {e.data.shareACL[kn]}
                                  </td>
                                  <td className='p-3 border' colSpan={1}>
                                    <button
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            'remove?' + e.data.shareACL[kn]
                                          )
                                        ) {
                                          onReady().then(
                                            async ({ user, db }) => {
                                              let uidValue = kn

                                              if (uidValue) {
                                                uidValue = (
                                                  uidValue || ''
                                                ).trim()
                                                // Collaborator
                                                let refObj1 = db.ref(
                                                  `profile/${user.uid}/canvas/${e._fid}/shareACL/${uidValue}`
                                                )
                                                refObj1.remove()

                                                // // Collaborator
                                                // let refObj2 = db.ref(
                                                //   `sharedWithMe/${uidValue}/${e._fid}`
                                                // )
                                                // refObj2.remove().then(() => {})

                                                ENState.listingReload++
                                              }
                                            }
                                          )
                                        }
                                      }}
                                      className='p-3 px-6 text-white bg-red-500 rounded-full'
                                    >
                                      Remove CoEditors
                                    </button>
                                  </td>
                                  <td className='p-3 border'>
                                    <button
                                      className='p-3 px-6 text-white bg-green-500 rounded-full'
                                      onClick={(ev) => {
                                        //
                                        copy(
                                          `${window.location.origin}/logic-cms/editor/${e.data.ownerID}/${e._fid}`
                                        )
                                        ev.target.innerText = 'Copied!'
                                        setTimeout(() => {
                                          ev.target.innerText = `Share & Copy Link`
                                        }, 1000)
                                      }}
                                    >
                                      Share & Copy Link
                                    </button>
                                  </td>
                                </tr>
                              )
                            })}
                      </thead>
                    </table>
                  </td>
                </tr>
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

//

//

//
