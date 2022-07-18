import { useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'

export function UIContent({ children, className }) {
  useLayoutEffect(() => {
    let doc = document.querySelector('#myroot')
    let div = document.createElement('div')
    doc.appendChild(div)

    div.className = className || ''
    let root = createRoot(div)
    root.render(children)
    return () => {
      doc.removeChild(div)
    }
  }, [children, className])

  return null
}
