import { firebase } from './firebase'
import copy from 'copy-to-clipboard'

export function ENWelcome() {
  let currentUser = firebase.auth().currentUser
  return (
    <div>
      <div className=' text-2xl'>Dear {currentUser.displayName},</div>
      <div className=' text-sm'>Welcome Back!</div>
      <div className=' text-xs '>
        Click to Copy User ID:
        <span
          className='ml-1 text-gray-500 underline cursor-pointer'
          onClick={(ev) => {
            copy(currentUser.uid)

            ev.target.innerText = 'Copied to Clipboard'

            setTimeout(() => {
              ev.target.innerText = currentUser.uid
            }, 1000)
          }}
        >
          {currentUser.uid}
        </span>
      </div>
      <div className=' text-sm text-right underline'>
        <a href='/logic-cms/logout'>Logout</a>
      </div>
    </div>
  )
}
