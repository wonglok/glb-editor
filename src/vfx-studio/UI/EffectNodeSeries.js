import { useAccessor } from '../store/use-accessor'
import { useENEditor } from '../store/use-en-editor'
import { useFilterEffectNode } from '../store/use-filter-effectnode'

export function EffectNodeSeries() {
  let glbObject = useAccessor((s) => s.glbObject)
  let openEffectNode = useAccessor((s) => s.openEffectNode)
  let ens = useFilterEffectNode({ glbObject })

  console.log(ens) // console.log(ens)
  return (
    <div>
      {ens.map((it) => {
        return (
          <div key={it.uuid}>
            {/*  */}
            <button
              onClick={() => {
                openEffectNode(it)
              }}
              className='w-full p-2 text-xs bg-yellow-300 border-b border-yellow-500'
            >
              {it.name}
            </button>
            {/*  */}
          </div>
        )
      })}
      {/*  */}
      {/*  */}
      {/*  */}
    </div>
  )
}
