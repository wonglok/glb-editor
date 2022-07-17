import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { Color } from 'three'

export function BGColor({ color = '#000000' }) {
  let get = useThree((s) => s.get)
  useEffect(() => {
    //

    let { scene } = get()
    //
    scene.background = new Color(color)
  }, [])
  return <></>
}
