import dynamic from 'next/dynamic'
// Step 5 - delete Instructions components
import Instructions from '@/components/dom/Instructions'
import Head from 'next/head'
import { ENLogicGraphAutoLoad } from '@/vfx-runtime/ENLogicGraph'
import { VRCanvas } from '@react-three/xr'

// import { Canvas } from '@react-three/fiber'
// import { BGColor } from '@/vfx-library/Generic/BG'
// import Shader from '@/components/canvas/Shader/Shader'

// Dynamic import is used to prevent a payload when the website start that will include threejs r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
// const Shader = dynamic(() => import('@/components/canvas/Shader/Shader'), {
//   ssr: false,
// })

// -
const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: false,
})

// DOM components goes here
const Page = (props) => {
  return (
    <>
      <Head>
        <title>Open Multiverse</title>
      </Head>
      {/* <Instructions /> */}
    </>
  )
}

// canvas components goes here
// It will receive same props as Page component (from getStaticProps, etc.)
Page.r3f = (props) => {
  let url = typeof window !== 'undefined' ? new URL(location.href) : null

  return (
    <LCanvas MyVRCanvas={VRCanvas}>
      {/* Landing Page WebGL */}
      {url && (
        <ENLogicGraphAutoLoad
          graphID={url.searchParams.get('graphID')}
        ></ENLogicGraphAutoLoad>
      )}
    </LCanvas>
  )
}

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Index',
    },
  }
}
