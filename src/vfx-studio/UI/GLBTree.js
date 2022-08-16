import { useAccessor } from '../store/use-accessor'
// import { useENEditor } from '../store/use-en-editor'

export function GLBTree() {
  let glbObject = useAccessor((s) => s.glbObject)
  let openEffectNode = useAccessor((s) => s.openEffectNode)
  // let updateSelected = useAccessor((s) => s.updateSelected)
  // let overlay = useENEditor((s) => s.overlay)
  let list = []
  glbObject?.scene?.getObjectByName('Scene').traverse((it) => {
    if (it.isObject3D && it.name !== 'Scene') {
      list.push(it)
    }
  })
  return (
    <div
      style={{
        maxHeight: 'calc(100vh - 300px)',
        overflow: 'scroll',
      }}
    >
      {list.map((li) => {
        return (
          <div
            key={li.uuid}
            className={
              '' +
              ` ${
                li.userData.effectNode
                  ? 'w-full p-2 text-xs text-right bg-green-300 border-b border-green-500 cursor-pointer hover:bg-green-400 '
                  : 'w-full p-2 text-xs text-right bg-yellow-300 border-b border-yellow-500 cursor-pointer hover:bg-yellow-400 '
              }`
            }
            onClick={() => {
              //
              openEffectNode(li)
              setTimeout(() => {
                openEffectNode(li)
              }, 100)
            }}
          >
            {li.name} {`${li.userData.effectNode ? '[EN]' : ''}`}
          </div>
        )
      })}
    </div>
  )
}

//
