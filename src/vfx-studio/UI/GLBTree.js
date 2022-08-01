import { useAccessor } from '../store/use-accessor'

export function GLBTree() {
  let glbObject = useAccessor((s) => s.glbObject)
  let updateSelected = useAccessor((s) => s.updateSelected)

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
            className='w-full p-2 text-xs text-right bg-yellow-300 border-b border-yellow-500 cursor-pointer hover:bg-yellow-400'
            onClick={() => {
              //
              updateSelected([li])
            }}
          >
            {li.name}
          </div>
        )
      })}
    </div>
  )
}
