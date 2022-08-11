//

import { ENWelcome } from '../../vfx-cms/ENWelcome'
import { LoginChecker } from '../../vfx-cms/LoginChecker'
import { ENProjectListing } from '../../vfx-cms/ENProjectListing'
import { ENSharedProjectListing } from '../../vfx-cms/ENSharedProjectListing'
import { ENProjectAdd } from '../../vfx-cms/ENProjectAdd'
import { DevToolNotice } from '../../vfx-cms/DevToolNotice'
// import { ENObjectAdd } from "../../vfx-cms/ENObjectAdd";
// import { ENObjectListing } from "../../vfx-cms/ENObjectListing";

export default function Home() {
  // if (process.env.NODE_ENV === 'production') {
  //   return <DevToolNotice></DevToolNotice>
  // }

  return (
    <LoginChecker logoutAynon={true}>
      <div className='h-full p-3 overflow-scroll lg:p-12'>
        <ENWelcome></ENWelcome>

        <br />
        <hr />
        <br />

        <ENProjectAdd></ENProjectAdd>
        <ENProjectListing></ENProjectListing>

        {/* <ENSharedProjectListing></ENSharedProjectListing> */}

        <br />
        <hr />
        <br />
        {/*
        <ENObjectAdd></ENObjectAdd>
        <ENObjectListing></ENObjectListing> */}
      </div>
    </LoginChecker>
  )
}
