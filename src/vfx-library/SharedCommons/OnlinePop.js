import {
  loginGoogle,
  loginGuest,
  setupFirebase,
  firebase,
  logout,
} from '@/vfx-cms/firebase'
import { Core } from '@/vfx-core/Core'
import { createRoot } from 'react-dom/client'

export class OnlinePop {
  constructor({ container, api, onDone = () => {} }) {
    let logoutBtn = document.createElement('div')

    logoutBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 12.771h-3.091c-.542 0-.82-.188-1.055-.513l-1.244-1.674-2.029 2.199 1.008 1.562c.347.548.373.922.373 1.42v4.235h-1.962v-3.981c-.016-1.1-1.695-2.143-2.313-1.253l-1.176 1.659c-.261.372-.706.498-1.139.498h-3.372v-1.906l2.532-.001c.397 0 .741-.14.928-.586l1.126-2.75c.196-.41.46-.782.782-1.102l2.625-2.6-.741-.647c-.223-.195-.521-.277-.812-.227l-2.181.381-.342-1.599 2.992-.571c.561-.107 1.042.075 1.461.462l2.882 2.66c.456.414.924 1.136 1.654 2.215.135.199.323.477.766.477h2.328v1.642zm-2.982-5.042c1.02-.195 1.688-1.182 1.493-2.201-.172-.901-.96-1.528-1.845-1.528-1.186 0-2.07 1.078-1.85 2.234.196 1.021 1.181 1.69 2.202 1.495zm4.982-5.729v15l6 5v-20h-6z"/></svg>`
    logoutBtn.style.position = 'absolute'
    logoutBtn.style.top = '25px'
    logoutBtn.style.right = '90px'
    logoutBtn.style.padding = '10px'
    logoutBtn.style.borderRadius = '50px'
    logoutBtn.style.background = 'rgb(255,255,255,0.5)'
    logoutBtn.style.display = 'none'

    logoutBtn.onclick = () => {
      logout().then(() => {
        window.location.reload()
      })
    }

    container.insertBefore(logoutBtn, container.children[0])

    setupFirebase()
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        onDone()
        logoutBtn.style.display = 'block'

        Core.now.renderMode = 'hd'
      } else {
        let div = document.createElement('div')

        div.style.position = 'absolute'
        div.style.top = 'calc(50% - 180px / 2)'
        div.style.left = 'calc(50% - 350px / 2)'
        div.style.borderRadius = '15px'
        div.style.backdropFilter = 'blur(5px)'
        div.style.boxShadow = '0px 10px 30px 0px black'
        //
        div.style.width = '350px'
        div.style.height = '180px'
        div.style.zIndex = '0'
        // div.style.backgroundColor = '#ffffff'

        let sub = document.createElement('div')
        sub.style.height = '100%'
        sub.style.width = '100%'
        let root = createRoot(sub)
        root.render(
          <GUILayers
            api={api}
            onDone={() => {
              onDone()
              Core.now.renderMode = 'hd'
              div.remove()
              logoutBtn.style.display = 'block'
            }}
          />
        )

        div.appendChild(sub)
        container.appendChild(div)
        api.onClean(() => {
          container.removeChild(div)
        })
      }
    })
  }
}

function GUILayers({ onDone }) {
  return (
    <div className='h-full py-3'>
      <div className='flex items-center justify-around h-full mb-3'>
        <div>
          <div
            onClick={() => {
              //
              loginGoogle().then(onDone)
            }}
            className='inline-flex items-center justify-center p-3 text-white bg-blue-500 cursor-pointer hover:scale-110 transition-transform duration-500 bg-opacity-80 rounded-xl w-36 h-36'
          >
            Google Login
          </div>
        </div>
        <div>
          <div
            onClick={() => {
              //
              loginGuest().then(onDone)
            }}
            className='inline-flex items-center justify-center p-3 text-white cursor-pointer hover:scale-110 transition-transform duration-500 bg-violet-500 bg-opacity-80 rounded-xl w-36 h-36'
          >
            Guest Login
          </div>
        </div>
      </div>
    </div>
  )
}
