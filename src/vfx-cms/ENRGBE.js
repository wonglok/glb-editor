import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { EquirectangularReflectionMapping } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

export function ENHDRI() {
  // let RGBELoader = require("three/examples/jsm/loaders/RGBELoader.js")
  //   .RGBELoader;
  let url = `/texture/bluradam.png`
  let { scene, gl } = useThree()
  // let chroma = new ShaderCubeChrome({ res: 128, renderer: gl });
  // useEffect((state, dt) => {
  //   chroma.compute({ time: dt });
  //   scene.environment = chroma.out.envMap;
  // }, []);

  useEffect(() => {
    let rgbe = new RGBELoader()
    rgbe.loadAsync(url).then((tex) => {
      tex.mapping = EquirectangularReflectionMapping

      scene.environment = tex
      //
    })

    return () => {
      scene.environment = null
      scene.background = null
    }
  }, [url])

  return null
}
