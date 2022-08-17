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
  let list = getArrayOfEditable({ glb: glbObject })

  let [filter, setFilter] = useState('')

  //
  useEffect(() => {
    setFilter('')
  }, [glbObject])

  let getClass = (li) => {
    // li.userData.effectNode

    if (selectedMeshes[0] && selectedMeshes[0].uuid === li.uuid) {
      return 'w-full p-1 text-xs text-right bg-lime-300 border-b border-lime-500 cursor-pointer hover:bg-lime-400 bg-opacity-30 hover:bg-opacity-30 border'
    } else if (li.isMesh && !li.isSkinnedMesh) {
      return 'w-full p-1 text-xs text-right bg-green-300 border-b border-green-500 cursor-pointer hover:bg-green-400 bg-opacity-30 hover:bg-opacity-30 border'
    } else if (li.isSkinnedMesh) {
      return 'w-full p-1 text-xs text-right bg-yellow-300 border-b border-yellow-500 cursor-pointer hover:bg-yellow-400 bg-opacity-30 hover:bg-opacity-30 border'
    } else if (li.isBone) {
      return 'w-full p-1 text-xs text-right bg-blue-300 border-b border-blue-500 cursor-pointer hover:bg-blue-400 bg-opacity-30 hover:bg-opacity-30 border'
    } else {
      return 'w-full p-1 text-xs text-right bg-gray-300 border-b border-gray-500 cursor-pointer hover:bg-gray-400 bg-opacity-30 hover:bg-opacity-30 border'
    }

    //   ? selectedMeshes[0] && selectedMeshes[0].uuid === li.uuid
    //     ? 'w-full p-2 text-xs text-right bg-blue-300 border-b border-blue-500 cursor-pointer hover:bg-blue-400 '
    //     : 'w-full p-2 text-xs text-right bg-green-300 border-b border-green-500 cursor-pointer hover:bg-green-400 '
    //   : 'w-full p-2 text-xs text-right bg-yellow-300 border-b border-yellow-500 cursor-pointer hover:bg-yellow-400 '
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
      <div
        style={{
          maxHeight: 'calc(100vh - 300px)',
          overflow: 'scroll',
        }}
        //
        //
        //
      >
        {glbObject && (
          <GLBTreeNode
            getClass={getClass}
            node={glbObject.scene.getObjectByName('Scene') || glbObject.scene}
          ></GLBTreeNode>
        )}
      </div>
    </>
  )
}

//

//

//
