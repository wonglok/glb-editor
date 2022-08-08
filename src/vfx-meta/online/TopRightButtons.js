import { UIContent } from '@/vfx-core/UIContent'
import { logout } from '../store/firebase'

export function TopRightButtons({ children }) {
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
        {children}
      </div>
    </UIContent>
  )
}
