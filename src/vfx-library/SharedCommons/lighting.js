import { Color, sRGBEncoding } from 'three'
import { WebGLRenderer } from 'three'
import { AmbientLight } from 'three'
import { EquirectangularReflectionMapping } from 'three'
import { RGBELoader } from 'three-stdlib'

/** @param {{ api: TJType }} */
export async function lighting({ api, hdrURL }) {
  /** @type {WebGLRenderer} */
  let gl = await api.ready.gl
  gl.outpueEncoding = sRGBEncoding
  gl.physicallyCorrectLights = true

  //
  // let scene = await api.ready.scene
  // let hdrLoader = new RGBELoader()

  // let hdr = await hdrLoader.loadAsync(hdrURL)
  // hdr.mapping = EquirectangularReflectionMapping
  // scene.background = hdr || new Color(0x000000)
  // scene.environment = hdr
  // scene.userData.hdr = hdr
}
