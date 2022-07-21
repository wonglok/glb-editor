import Instructions from '@/components/dom/Instructions'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Box = dynamic(() => import('@/components/canvas/Box'), {
  ssr: false,
})

const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: false,
})

// Step 5 - delete Instructions components
const Page = (props) => {
  return (
    <>
      <div>
        <Link href={`/`}>Hi</Link>
      </div>
      {/* <Instructions /> */}
    </>
  )
}

Page.r3f = (props) => (
  <>
    <LCanvas>{/* <Box route='/' /> */}</LCanvas>
  </>
)

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'BoxPage',
    },
  }
}

//

//

//

//
