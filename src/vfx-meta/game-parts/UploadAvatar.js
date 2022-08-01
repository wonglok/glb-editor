import { EffectNodeRuntime } from '@/vfx-studio/effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useState } from 'react'
import { DRACOLoader } from 'three140/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three140/examples/jsm/loaders/GLTFLoader'
import { useMetaStore } from '../store/use-meta-store'

export function UploadAvatar() {
  let [glb, setGLB] = useState()
  return (
    <group>
      <Text
        fontSize={1}
        position={[0, 4, -1]}
        onClick={() => {
          //

          let input = document.createElement('input')
          input.type = 'file'
          input.onchange = async ({ target: { files } }) => {
            let file = files[0]
            if (file) {
              let ab = await file.arrayBuffer()

              const dracoLoader = new DRACOLoader()
              dracoLoader.setDecoderPath('/draco/')
              useMetaStore.getState().setStartLoading()
              let loader = new GLTFLoader()
              loader.parseAsync(ab, '/').then((glb) => {
                // setGLB(glb)
                setGLB(glb)
                useMetaStore.getState().setDoneLoading()
              })
            }
          }

          input.click()

          //
        }}
        rotation-x={Math.PI * -0.25}
      >
        Upload Avatar File
      </Text>

      <group position={[0, -0.62, 0]}>
        {glb && (
          <>
            <primitive object={glb.scene}></primitive>
            <EffectNodeRuntime glbObject={glb}></EffectNodeRuntime>
          </>
        )}
      </group>
    </group>
  )
}