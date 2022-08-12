import { useLoader, useThree } from '@react-three/fiber'
import { EquirectangularReflectionMapping } from 'three'
import { RGBELoader } from 'three140/examples/jsm/loaders/RGBELoader'

export function BG({ url }) {
  let scene = useThree((s) => s.scene)
  let hdri = useLoader(RGBELoader, url)

  hdri.mapping = EquirectangularReflectionMapping
  scene.background = hdri
  return null
}
