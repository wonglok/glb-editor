// import { EffectNodeRuntime } from '@/vfx-studio/effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useState } from 'react'
// import { DRACOLoader } from 'three140/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three140/examples/jsm/loaders/GLTFLoader'
import { useMetaStore } from '../store/use-meta-store'

export function UploadAvatar() {
  let uploadAvatar = useMetaStore((s) => s.uploadAvatar)

  let setAvatar = useMetaStore((s) => s.setAvatar)

  let [phase, setPhase] = useState('')
  return (
    <group>
      <Text
        fontSize={0.5}
        position={[0, 0.5, 0]}
        onClick={() => {
          //

          let input = document.createElement('input')
          input.type = 'file'
          input.onchange = async ({ target: { files } }) => {
            let file = files[0]
            if (file) {
              //
              //
              setPhase('loading')

              uploadAvatar(file).then(async ({ url }) => {
                //
                //

                setPhase('')

                let foundRPM = false
                await new GLTFLoader()
                  .loadAsync(URL.createObjectURL(file))
                  .then((glb) => {
                    glb.scene.traverse((it) => {
                      if (it.name.indexOf('Wolf3D_') !== -1) {
                        foundRPM = true
                        console.log(it.name)
                      }
                    })
                  })

                setAvatar({
                  vendor: foundRPM ? 'rpm' : 'temp',
                  avatarURL: url, //URL.createObjectURL(file),
                })
              })
              //
            }
          }

          input.click()

          //
        }}
        rotation-x={Math.PI * -0.25}
      >
        Upload Avatar File {(phase === 'loading' && 'Uploading....') || ''}
      </Text>

      {/* <group position={[0, -0.62, 0]}>
        {glb && (
          <>
            <primitive object={glb.scene}></primitive>
            <EffectNodeRuntime glbObject={glb}></EffectNodeRuntime>
          </>
        )}
      </group> */}
    </group>
  )
}
