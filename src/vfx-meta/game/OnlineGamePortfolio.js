// import { UIContent } from '@/vfx-core/UIContent'
// import { ClosetBtns } from '../game-parts/ClosetBtns'
// import { UIContent } from '@/vfx-core/UIContent'
import { Suspense, useMemo } from 'react'
import { ARBG } from '../game-parts/ARBG'
// import { useFrame, useThree } from '@react-three/fiber'
// import { useEffect } from 'react'
import { BG, BGPng } from '../game-parts/BG'
import { Floor } from '../game-parts/Floor'
import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
import { TopLeft } from '../game-parts/TopLeft'
// import { Effects } from '../game-vfx/Effects'
// import { EnvLight } from '../game-vfx/EnvLight'
import { EffectButton } from '../online/EffectButton'
import { OnlineSystem } from '../online/OnlineSystem'
import { EffectNodeRuntime } from '@/vfx-studio/effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { useGLTF } from '@react-three/drei'
import { AnimationMixer } from 'three'
import { useFrame } from '@react-three/fiber'

export function OnlineGamePortfolio() {
  return (
    <group>
      {/*  */}
      {/*  */}

      <Suspense fallback={null}></Suspense>
      <BGPng url={`/bg/galaxy2048.png`}></BGPng>
      <HDR url={`/hdr/moonless_golf_1k.hdr`}> </HDR>
      <Floor url={'/scene/landing/os-effect.glb'}></Floor>

      {/*  */}
      {/* <EnvLight></EnvLight> */}

      <OnlineSystem mapID='/scene/landing/os.glb'>
        <>
          <Player></Player>
        </>
      </OnlineSystem>

      <group scale={2}>
        <Insert></Insert>
      </group>
      {/* <ARBG></ARBG> */}

      <TopLeft>
        <EffectButton></EffectButton>
      </TopLeft>
    </group>
  )
}

//

function Insert() {
  let glbObject = useGLTF(`/demo/shield-guy-stage1.glb`)

  let anim = useMemo(() => new AnimationMixer(glbObject.scene), [glbObject])
  useFrame((_, dt) => {
    anim.update(dt)
  })

  anim.clipAction(glbObject.animations[0])?.play()
  return (
    <>
      <EffectNodeRuntime
        glbObject={glbObject}
        originalGLBObject={glbObject}
        disabledNodes={[]}
        isEditingMode={false}
      ></EffectNodeRuntime>

      <primitive object={glbObject.scene}></primitive>
    </>
  )
}
