import { useLoader, useThree } from '@react-three/fiber'
import { EquirectangularReflectionMapping } from 'three'
import { TextureLoader } from 'three140'
import { RGBELoader } from 'three140/examples/jsm/loaders/RGBELoader'

export function BG({ url }) {
  let scene = useThree((s) => s.scene)
  let hdri = useLoader(RGBELoader, url)

  hdri.mapping = EquirectangularReflectionMapping
  scene.background = hdri
  return null
}

export function BGPng({ url = `/bg/galaxy2048.png` }) {
  let scene = useThree((s) => s.scene)
  let tex = useLoader(TextureLoader, url)

  tex.mapping = EquirectangularReflectionMapping
  scene.background = tex
  return null
}

//public
