import { ENLogicGraph } from '@/vfx-cms/ENLogicGraph'
import { LoginChecker } from '@/vfx-cms/LoginChecker'
import Head from 'next/head'

//
export default function EditCanvas() {
  return (
    <>
      <Head>
        <title>Graph VFX Editor</title>
      </Head>
      <LoginChecker logoutAynon={true}>
        <ENLogicGraph></ENLogicGraph>
      </LoginChecker>
    </>
  )
}
