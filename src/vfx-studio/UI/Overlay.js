import { useRouter } from 'next/router'

export function Overlay() {
  let router = useRouter()

  return (
    <div className='' id={'editorOverlay'}>
      {/*  */}
      <div className='absolute top-0 left-0'></div>
    </div>
  )
}
