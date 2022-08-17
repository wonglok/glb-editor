import { UIContent } from '@/vfx-core/UIContent'

export function TopLeft({ children }) {
  return (
    <>
      <UIContent>
        <div className='absolute top-0 left-0 m-3 w-36'>{children}</div>
      </UIContent>
    </>
  )
}
