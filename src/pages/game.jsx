import { useEffect } from 'react'

export default function Game() {
  useEffect(() => {
    window.location.assign('/')
  }, [])
  return <div className='w-full h-full'></div>
}
