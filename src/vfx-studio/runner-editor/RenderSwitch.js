import { useFrame } from '@react-three/fiber'
// import { useAccessor } from 'vfx-studio/store/use-accessor'

export function RenderSwitch() {
  ///

  useFrame((st, dt) => {
    st.gl.render(st.scene, st.camera)
  }, 100)
  return (
    <>
      {/*  */}
      {/*  */}
    </>
  )
}
