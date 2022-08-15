import { useAccessor } from '../store/use-accessor'
import { useENEditor } from '../store/use-en-editor'

export function GLBTree() {
  let glbObject = useAccessor((s) => s.glbObject)
  let openEffectNode = useAccessor((s) => s.openEffectNode)
  let updateSelected = useAccessor((s) => s.updateSelected)
  let overlay = useENEditor((s) => s.overlay)
  let list = []
  glbObject?.scene?.traverse((it) => {
    if (it.geometry) {
      list.push(it)
    }
  })
  return (
    <div>
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
              updateSelected([li])
              setTimeout(() => {
                updateSelected([li])
              }, 10)
              setTimeout(() => {
                updateSelected([li])
              }, 20)
              setTimeout(() => {
                updateSelected([li])
              }, 30)
              setTimeout(() => {
                updateSelected([li])
              }, 40)
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

//
