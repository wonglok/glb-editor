import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'

export function UIContent({ children, className }) {
  useEffect(() => {
    let clean = () => {}
    let tttt = setInterval(() => {
      let doc = document.querySelector('#myroot')
      if (doc) {
        let div = document.createElement('div')
        clearInterval(tttt)
        doc.appendChild(div)
        div.className = className || ''
        let root = createRoot(div)
        root.render(children)
        clean = () => {
          doc.removeChild(div)
        }
      }
    })

    return () => {
      clean()
    }
  }, [children, className])

  return null
}
