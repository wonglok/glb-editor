import { UIContent } from '@/vfx-core/UIContent'

export function BottomRight({ children }) {
  return (
    <>
      <UIContent>
        <div className='absolute bottom-0 right-0 m-3 w-36'>{children}</div>
      </UIContent>
    </>
  )
}
