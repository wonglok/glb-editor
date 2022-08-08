import { UIContent } from '@/vfx-core/UIContent'
import { loginGoogle, loginGuest } from '../store/firebase'

export function LoginButton({}) {
  return (
    <UIContent>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '300px',
          height: '150px',
          position: 'fixed',

          top: 'calc(50% - 300px / 2)',
          left: 'calc(50% - 300px / 2)',
        }}
      >
        <div
          style={{
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            boxShadow: '0px 0px 30px 0px rgba(255,255,255,0.5)',
          }}
          onClick={() => {
            loginGoogle()
          }}
          className='inline-block w-1/2 p-10 mx-3 text-center text-white bg-blue-500 cursor-pointer bg-opacity-40 rounded-xl'
        >
          Login Google
        </div>
        <div
          style={{
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            boxShadow: '0px 0px 30px 0px rgba(255,255,255,0.5)',
          }}
          onClick={() => {
            loginGuest()
          }}
          className='inline-block w-1/2 p-10 mx-3 text-center text-white bg-purple-500 cursor-pointer bg-opacity-40 rounded-xl'
        >
          Login Guest
        </div>
      </div>
    </UIContent>
  )
}
