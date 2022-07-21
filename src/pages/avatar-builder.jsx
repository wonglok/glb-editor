// Step 5 - delete Instructions components
// import Instructions from '@/components/dom/Instructions'
import Head from 'next/head'
// import { ENLogicGraphAutoLoad } from '@/vfx-runtime/ENLogicGraph'
// import { Canvas, useFrame, useThree } from '@react-three/fiber'
// import { BGColor } from '@/vfx-library/Generic/BG'
// import { HomePageGraphID } from 'firebase.config'

// import { useEffect } from 'react'
// import { Core } from '@/vfx-core/Core'
// import { Box } from '@react-three/drei'
// import { PerspectiveCamera, Vector2 } from 'three'
import { AvatarPlace } from '@/vfx-library/AvatarPlace/AvatarPlace'
// import dynamic from 'next/dynamic'
import dynamic from 'next/dynamic'

// import Shader from '@/components/canvas/Shader/Shader'

// Dynamic import is used to prevent a payload when the website start that will include threejs r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
// const Shader = dynamic(() => import('@/components/canvas/Shader/Shader'), {
//   ssr: false,
// })

/* <ButtonVR></ButtonVR> */
/* <Instructions /> */

const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: false,
})
// dom components goes here
const Page = (props) => {
  return (
    <Head>
      <title>Open Multiverse</title>
    </Head>
  )
}

Page.r3f = (props) => (
  <>
    <LCanvas>
      <AvatarPlace></AvatarPlace>
    </LCanvas>
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
