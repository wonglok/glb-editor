import { useEffect } from 'react'
import { ENState } from './ENState'
import { onReady } from './firebase'

export function ENSharedProjectListing() {
  //
  ENState.makeKeyReactive('sharedListing')
  ENState.makeKeyReactive('sharedListingReload')

  useEffect(() => {
    onReady().then(({ user, db }) => {
      //
      //
      let sharedListingRef = db.ref(`sharedWithMe/${user.uid}`)

      let load = () => {
        sharedListingRef.once('value', (snap) => {
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

            ENState.sharedListing = arr
            console.log(arr)
          }
        })
      }

      load()
      ENState.onChange('sharedListingReload', () => {
        load()
      })
    })
  }, [ENState.sharedListingReload])

  return (
    <div>
      <div>
        <table>
          <thead>
            <tr>
              <th className='p-3 border  ' colSpan={1}>
                <span className='w-24 inline-block'></span>Title
                <span className='w-24 inline-block'></span>
              </th>
              <th className='p-3 border  ' colSpan={1}>
                <span className='w-3 inline-block'></span>CanvasID
                <span className='w-3 inline-block'></span>
              </th>
              <th className='p-3 border ' colSpan={5}>
                Start
              </th>
              {/* <th>JSON</th> */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
