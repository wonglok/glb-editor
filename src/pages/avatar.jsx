import dynamic from 'next/dynamic'
// Step 5 - delete Instructions components
import Instructions from '@/components/dom/Instructions'
import Head from 'next/head'
import { ENLogicGraphAutoLoad } from '@/vfx-runtime/ENLogicGraph'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { BGColor } from '@/vfx-library/Generic/BG'
import { HomePageGraphID } from 'firebase.config'

import { useEffect } from 'react'
import { Core } from '@/vfx-core/Core'
import { Box } from '@react-three/drei'
import { PerspectiveCamera, Vector2 } from 'three'
import { AvatarPlace } from '@/vfx-library/AvatarPlace/AvatarPlace'

// import Shader from '@/components/canvas/Shader/Shader'

// Dynamic import is used to prevent a payload when the website start that will include threejs r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Shader = dynamic(() => import('@/components/canvas/Shader/Shader'), {
  ssr: false,
})

// dom components goes here
const Page = (props) => {
  return (
    <>
      <Head>
        <title>Open Multiverse</title>
      </Head>
      {/* <ButtonVR></ButtonVR> */}
      {/* <Instructions /> */}
    </>
  )
}

Page.r3f = (props) => (
  <>
    {/* openverse landing page */}
    {/* <ButtonVR></ButtonVR>
    <CoreVR></CoreVR> */}
    <AvatarPlace></AvatarPlace>
    {/*  */}
    {/* <ENLogicGraphAutoLoad graphID={HomePageGraphID}></ENLogicGraphAutoLoad> */}
  </>
)

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Index',
    },
  }
}

// function ButtonVR() {
//   let renderer = useThree((s) => s.gl)
//   useEffect(() => {
//     let run = async () => {
//       let { VRButton } = await import('three/examples/jsm/webxr/VRButton.js')

//       let myroot = document.querySelector('#myroot')
//       let btn = VRButton.createButton(renderer)
//       btn.style.zIndex = 10000
//       myroot.appendChild(btn)
//     }
//     run()
//   }, [])
//   return null
// }

// //
// function CoreVR() {
//   useFrame(() => {
//     //
//   }, 9999999999)
//   let renderer = useThree((s) => s.gl)
//   let scene = useThree((s) => s.scene)
//   useEffect(() => {
//     let run = async () => {
//       renderer.xr.enabled = true
//       let camera = new PerspectiveCamera()
//       camera.position.z = 2
//       camera.position.y = 0.5
//       let v2 = new Vector2()
//       renderer.setAnimationLoop(() => {
//         renderer.getSize(v2)
//         camera.aspect = v2.x / v2.y
//         renderer.xr.updateCamera(camera)
//         camera.updateMatrix()
//         camera.updateProjectionMatrix()

//         renderer.render(scene, cameraArr)
//       })

//       // let { XRControllerModelFactory } = await import(
//       //   'three/examples/jsm/webxr/XRControllerModelFactory.js'
//       // )

//       // The XRControllerModelFactory will automatically fetch controller models
//       // that match what the user is holding as closely as possible. The models
//       // should be attached to the object returned from getControllerGrip in
//       // order to match the orientation of the held device.

//       // const controllerModelFactory = new XRControllerModelFactory()

//       // let controllerGrip1 = renderer.xr.getControllerGrip(0)
//       // controllerGrip1.add(
//       //   controllerModelFactory.createControllerModel(controllerGrip1)
//       // )
//       // scene.add(controllerGrip1)

//       // let controllerGrip2 = renderer.xr.getControllerGrip(1)
//       // controllerGrip2.add(
//       //   controllerModelFactory.createControllerModel(controllerGrip2)
//       // )
//       // scene.add(controllerGrip2)
//     }
//     run()
//   }, [])
//   return null
// }
