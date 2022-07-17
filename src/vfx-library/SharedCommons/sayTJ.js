import { TJCore } from '@/vfx-core/TJCore'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useMemo, useCallback, useState } from 'react'
import {
  Object3D,
  PerspectiveCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

let mini = new TJCore({
  selfloop: false,
  name: 'TJCore',
})

let nowType = {
  gl: WebGLRenderer,
  camera: PerspectiveCamera,
  scene: Scene,
  mounter: Object3D,
  size: Vector2,
}

export let TJType = {
  //
  //

  onChange: mini.onChange,
  onClean: mini.onClean,
  onLoop: mini.onLoop,
  onResize: mini.onResize,
  makeKeyReactive: mini.makeKeyReactive,
  reactTo: mini.makeKeyReactive,
  makeSub: mini.makeSub,
  autoEvent: mini.autoEvent,

  now: nowType,
  ready: nowType,
}

/** @type {TJType} */
export const JT = mini

/** @returns {TJType} */
let i = 0
export const sayTJ = ({ mounter, services }) => {
  let iTJ = new TJCore({
    name: 'iThankJesus_' + i++,
  })

  iTJ.now.mounter = mounter

  iTJ.now.gl = services.gl
  iTJ.now.camera = services.camera
  iTJ.now.scene = services.scene
  iTJ.now.size = services.size
  iTJ.now.mouse = services.mouse

  return iTJ
}

export function TJLab({ init }) {
  let ref = useRef()
  let { get } = useThree()

  let services = useMemo(() => {
    return get()
  }, [])

  useEffect(() => {
    let mounter = ref.current

    let api = sayTJ({ mounter, services })
    api.onClean(() => {
      mounter.clear()
    })

    init({ api })

    return () => {
      api.clean()
    }
  }, [])

  //
  return <group ref={ref}></group>
}
