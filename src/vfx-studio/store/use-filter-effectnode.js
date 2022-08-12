// import { useAccessor } from './use-accessor'

export function useFilterEffectNode({ glbObject }) {
  // let glbObject = useAccessor((s) => s.glbObject)

  let array = []

  if (glbObject) {
    glbObject.scene.traverse((it) => {
      //
      if (it.userData.effectNode) {
        array.push(it)
      }
    })
  }

  return array
}
