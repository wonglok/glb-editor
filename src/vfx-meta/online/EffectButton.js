import { useEffect } from 'react'
import { useRender } from '../store/use-render'

export function EffectButton({}) {
  const enable = useRender((s) => s.enable)
  const setRender = useRender((s) => s.setRender)

  let enableButtonToggle = useRender((s) => s.enableButtonToggle)
  useEffect(() => {
    setRender(true)
  }, [setRender])

  return (
    enableButtonToggle && (
      <div
        style={{
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          boxShadow: '0px 0px 30px 0px rgba(0,0,255,0.5)',
        }}
        onClick={() => {
          //
          setRender(!enable)
        }}
        className='inline-block w-full px-3 py-2 mb-4 text-center text-white bg-blue-500 cursor-pointer rounded-xl'
      >
        Toggle Render
      </div>
    )
  )
}

//

//

//

//

//

//

//

//

//

//

//

//
