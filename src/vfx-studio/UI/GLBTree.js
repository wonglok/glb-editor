import { useEffect, useState } from 'react'
import { getArrayOfEditable, useAccessor } from '../store/use-accessor'
import { GLBTreeNode } from './GLBTreeNode'
// import { useENEditor } from '../store/use-en-editor'

export function GLBTree() {
  let glbObject = useAccessor((s) => s.glbObject)
  let openEffectNode = useAccessor((s) => s.openEffectNode)
  // let updateSelected = useAccessor((s) => s.updateSelected)
  let selectedMeshes = useAccessor((s) => s.selectedMeshes)
  // let overlay = useENEditor((s) => s.overlay)
  // let list = getArrayOfEditable({ glb: glbObject })

  let [filter, setFilter] = useState('')

  //
  useEffect(() => {
    setFilter('')
  }, [glbObject])

  let getClass = (li, colorOnly = false, level = '500') => {
    let nothing = `gray-${level}`
    // let selected = `blue-${level}`
    let mesh = `yellow-${level}`
    let skinnedMesh = `yellow-${level}`
    let bone = `blue-${level}`
    let others = `gray-${level}`
    if (!li) {
      return `${nothing}`
    }

    if (li.isMesh && !li.isSkinnedMesh) {
      return `${mesh}`
    } else if (li.isSkinnedMesh) {
      return `${skinnedMesh}`
    } else if (li.isBone) {
      return `${bone}`
    } else {
      return `${others}`
    }

    //   ? selectedMeshes[0] && selectedMeshes[0].uuid === li.uuid
    //     ? 'w-full p-2 text-xs text-right bg-blue-300 border-blue-500 cursor-pointer hover:bg-blue-400 '
    //     : 'w-full p-2 text-xs text-right bg-green-300 border-green-500 cursor-pointer hover:bg-green-400 '
    //   : 'w-full p-2 text-xs text-right bg-yellow-300 border-yellow-500 cursor-pointer hover:bg-yellow-400 '
  }
  return (
    <>
      <input
        type={'text'}
        className='w-full p-2'
        placeholder='Search'
        onKeyDownCapture={(ev) => {
          ev.stopPropagation()
        }}
        onInput={(ev) => {
          setFilter(ev.target.value)
        }}
      ></input>
      {/*  */}
      {/*  */}
      <div
        style={{
          maxHeight: 'calc(100vh - 300px)',
          overflow: 'scroll',
        }}
        //
        //
        //
        className='p-2'
      >
        {glbObject &&
          glbObject.scene.children.map((k) => {
            return (
              <GLBTreeNode
                isSelected={
                  selectedMeshes[0] && selectedMeshes[0].uuid === k.uuid
                }
                getClass={getClass}
                key={k.uuid}
                node={k}
              ></GLBTreeNode>
            )
          })}
      </div>
    </>
  )
}

//

//

//
