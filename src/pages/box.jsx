import Instructions from '@/components/dom/Instructions'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Box = dynamic(() => import('@/components/canvas/Box'), {
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

Page.r3f = (props) => <>{/* <Box route='/' /> */}</>

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
