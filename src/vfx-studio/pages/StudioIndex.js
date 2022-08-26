import { Core } from '@/vfx-core/Core'
import { useRouter } from 'next/router'
import { getID } from '@/vfx-runtime/ENUtils'

import { Slug } from '@/vfx-studio/shared/slug'
import { writeGLB } from '@/vfx-studio/shared/storage'
import { FileInput } from '@/vfx-studio/UI/FileInput'
import { MyFiles } from '@/vfx-studio/UI/MyFiles'
import { TryMe } from '../UI/TryMe'

export default function StudioHome() {
  let router = useRouter()
  return (
    <div>
      <div className='absolute w-full h-full'>
        {/* <!-- Mobile --> */}
        <nav className='w-full mx-auto bg-white shadow'>
          <div className='container flex items-center justify-between h-16 px-6 mx-auto lg:items-stretch'>
            <div className='flex items-center h-full'>
              <div
                aria-label='Home'
                role='img'
                className='flex items-center mr-10'
              >
                <img
                  src='https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_Grey_background-svg1.svg'
                  alt='logo'
                />
                <a href='/'>
                  <h3 className='hidden ml-3 text-base font-bold leading-tight tracking-normal text-gray-800 lg:block'>
                    Agape EffectNode Engine
                  </h3>
                </a>
              </div>
              <ul className='items-center hidden h-full pr-12 xl:flex'>
                <li className='flex items-center h-full text-sm tracking-normal text-indigo-700 border-b-2 border-indigo-700 cursor-pointer hover:text-indigo-700'>
                  <a href='/editor'> My Projects</a>
                </li>
                {/* <li className='flex items-center h-full mx-10 text-sm tracking-normal cursor-pointer hover:text-indigo-700 text-gry-800'>
                  <a href='#'>Products</a>
                </li>
                <li className='flex items-center h-full mr-10 text-sm tracking-normal cursor-pointer hover:text-indigo-700 text-gry-800'>
                  <a href='#'>Performance</a>
                </li>
                <li className='flex items-center h-full text-sm tracking-normal text-gray-800 cursor-pointer hover:text-indigo-700'>
                  <a href='#'>Deliverables</a>
                </li> */}
              </ul>
            </div>
            <div className='items-center justify-end hidden h-full xl:flex'>
              <div className='flex items-center w-full h-full'>
                <div className='flex items-center w-full h-full pr-12 border-r'>
                  {/* <div className='relative w-full'>
                    <div className='absolute inset-0 w-4 h-4 m-auto ml-3 text-gray-600'>
                      <img
                        src='https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_Grey_background-svg3.svg'
                        alt='search'
                      />
                    </div>
                    <input
                      className='w-56 py-2 pl-8 text-sm text-gray-500 placeholder-gray-600 bg-gray-100 border border-gray-100 rounded focus:outline-none focus:border-indigo-700'
                      type='text'
                      placeholder='Search'
                    />
                  </div> */}
                </div>
                <div className='flex w-full h-full'>
                  {/* <div className='flex items-center justify-center w-32 h-full text-gray-600 border-r cursor-pointer'>
                    <a
                      aria-label='show notifications'
                      role='link'
                      href='#'
                      className='w-6 h-6 text-gray-600 cursor-pointer xl:w-auto xl:h-auto'
                    >
                      <img
                        src='https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_Grey_background-svg6.svg'
                        alt='notifications'
                      />
                    </a>
                  </div> */}
                  <div
                    aria-haspopup='true'
                    className='relative flex items-center justify-end w-full cursor-pointer'
                    data-ha='dropdownHandler(this)'
                  >
                    {/* <button
                      aria-haspopup='true'
                      data-ha='dropdownHandler(this)'
                      className='flex items-center rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800'
                    >
                      <img
                        className='object-cover w-10 h-10 rounded-full'
                        src='https://tuk-cdn.s3.amazonaws.com/assets/components/sidebar_layout/sl_1.png'
                        alt='avatar'
                      />
                      <p className='ml-2 text-sm text-gray-800'>Jane Doe</p>
                    </button> */}
                    <ul className='absolute left-0 z-40 hidden w-40 p-2 mt-64 bg-white border-r rounded shadow'>
                      <li className='py-2 text-sm tracking-normal text-gray-600 cursor-pointer leading-3 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none'>
                        <div className='flex items-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='icon icon-tabler icon-tabler-user'
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            fill='none'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <path stroke='none' d='M0 0h24v24H0z' />
                            <circle cx='12' cy='7' r='4' />
                            <path d='M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2' />
                          </svg>
                          <a href='#' className='ml-2'>
                            My Profile
                          </a>
                        </div>
                      </li>
                      <li className='flex items-center py-2 mt-2 text-sm tracking-normal text-gray-600 cursor-pointer leading-3 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='icon icon-tabler icon-tabler-help'
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          strokeWidth='1.5'
                          stroke='currentColor'
                          fill='none'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path stroke='none' d='M0 0h24v24H0z' />
                          <circle cx='12' cy='12' r='9' />
                          <line x1='12' y1='17' x2='12' y2='17.01' />
                          <path d='M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4' />
                        </svg>
                        <a href='#' className='ml-2'>
                          Help Center
                        </a>
                      </li>
                      <li className='flex items-center py-2 mt-2 text-sm tracking-normal text-gray-600 cursor-pointer leading-3 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='icon icon-tabler icon-tabler-settings'
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          strokeWidth='1.5'
                          stroke='currentColor'
                          fill='none'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path stroke='none' d='M0 0h24v24H0z' />
                          <path d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                          <circle cx='12' cy='12' r='3' />
                        </svg>
                        <a href='#' className='ml-2'>
                          Account Settings
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex items-center visible xl:hidden'>
              <div>
                {/* <button
                  id='menu'
                  className='text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800'
                  data-ha='sidebarHandler(true) '
                >
                  <img
                    src='https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_Grey_background-svg7.svg'
                    alt='toggler'
                  />
                </button> */}
              </div>
            </div>
          </div>
        </nav>
        {/* <!-- Navigation ends --> */}
        {/* <!-- Page title starts --> */}
        <div className='container flex flex-col items-start justify-between px-6 pb-6 mx-auto my-12 border-b border-gray-300 lg:flex-row lg:items-center'>
          <div>
            <h4 className='text-2xl font-bold leading-tight text-gray-800'>
              Decenralisted GLB Editor
            </h4>
          </div>
          <div className='mt-6 lg:mt-0'>
            <a href='/'>
              <button className='px-6 py-2 mx-2 my-2 text-sm text-indigo-700 bg-white rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white hover:bg-gray-100'>
                Back to Home
              </button>
            </a>

            <a href='/clothes'>
              <button className='px-6 py-2 mx-2 my-2 mr-8 text-sm text-indigo-700 bg-white rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white hover:bg-gray-100'>
                Back to Wardrobe
              </button>
            </a>

            <TryMe
              onFile={async ({ buffer, file, name, done }) => {
                // file
                // console.log(file)
                let { fileID } = await writeGLB({
                  name: name + '-' + new Date().getTime(),
                  buffer,
                })

                Core.now.reloadFileList = getID()

                done()
                router.push(`/${Slug}/${fileID}`)
              }}
            ></TryMe>
          </div>
        </div>
        {/* <!-- Page title ends --> */}
        <div className='container px-6 mx-auto'>
          {/* <!-- Remove class [ h-64 ] when adding a card block --> */}
          {/* <!-- Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border --> */}
          <div className='w-full '>
            {/* <!-- Place your content here --> */}

            <div className=''>
              <div>
                <FileInput
                  onFile={async ({ buffer, file, name }) => {
                    // file
                    // console.log(file)
                    writeGLB({ name, buffer })
                    Core.now.reloadFileList = getID()
                  }}
                ></FileInput>
              </div>

              <MyFiles
                onOpen={(file) => {
                  router.push(`/${Slug}/${file.fileID}`)
                }}
              ></MyFiles>

              {/*  */}
            </div>
          </div>
        </div>
      </div>

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
    </div>
  )
}
