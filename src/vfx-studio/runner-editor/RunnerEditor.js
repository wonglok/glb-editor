import { Canvas } from '@react-three/fiber'
import { sRGBEncoding } from 'three'
import { EffectNodeRuntime } from '@/vfx-studio/effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { SceneContent } from '@/vfx-studio/UI3D/SceneContent'
import { RenderSwitch } from './RenderSwitch'

export function RunnerEditor() {
  return (
    <div className='w-full h-full'>
      <Canvas
        onCreated={({ gl }) => {
          gl.physicallyCorrectLights = true
          gl.outputEncoding = sRGBEncoding
        }}
      >
        <RenderSwitch></RenderSwitch>
        <SceneContent></SceneContent>
      </Canvas>
    </div>
  )
}
