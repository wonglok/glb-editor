import { UIContent } from '@/vfx-core/UIContent'
import { logout } from '../store/firebase'

export function LogoutButtons({}) {
  return (
    <UIContent>
      <div
        style={{
          justifyContent: 'space-around',
          alignItems: 'center',
          position: 'fixed',

          top: 'calc(10px)',
          right: 'calc(10px)',
        }}
      >
        <div
          style={{
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            boxShadow: '0px 0px 30px 0px rgba(0,0,255,0.5)',
          }}
          onClick={() => {
            logout()
          }}
          className='inline-block w-full px-10 py-2 text-center text-white bg-blue-500 cursor-pointer rounded-xl'
        >
          Logout
        </div>
      </div>
    </UIContent>
  )
}
