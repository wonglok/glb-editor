// import { UIContent } from '@/vfx-core/UIContent'
// import { UIContent } from '@/vfx-core/UIContent'
// import { useEffect } from 'react'
import { BG } from '../game-parts/BG'
import { ClothesUI } from '../game-parts/ClothesUI'
import { Floor } from '../game-parts/Floor'
// import { HDR } from '../game-parts/HDR'
import { Player } from '../game-parts/Player'
import { TopLeft } from '../game-parts/TopLeft'
// import { Effects } from '../game-vfx/Effects'
import { EnvLight } from '../game-vfx/EnvLight'
import { EffectButton } from '../online/EffectButton'
import { OnlineSystem } from '../online/OnlineSystem'
// import { useRender } from '../store/use-render'

export function ChangeClothes() {
  return (
    <group>
      <Floor url={'/scene/closet/closet.glb'}></Floor>
      {/* <HDR></HDR> */}
      <EnvLight></EnvLight>
      <BG url={`/hdr/moonless_golf_1k.hdr`}></BG>

      <OnlineSystem mapID='closet'>
        <>
          <Player></Player>
          <ClothesUI></ClothesUI>
          {/* <Effects></Effects> */}
        </>
      </OnlineSystem>

      <TopLeft>
        <EffectButton></EffectButton>
      </TopLeft>

      {/* <TopLeft></TopLeft> */}
    </group>
  )
}

//

// function TopLeft() {
//   const enable = useRender((s) => s.enable)
//   const setRender = useRender((s) => s.setRender)

//   //
//   useEffect(() => {
//     setRender(true)
//   }, [])
//   return (
//     <>
//       <UIContent>
//         <div className='absolute top-0 left-0'>
//           <button
//             className='p-3 m-3 bg-white rounded-lg'
//             onClick={() => {
//               //
//               setRender(!enable)
//             }}
//           >
//             Toggle Render
//           </button>
//         </div>
//       </UIContent>
//     </>
//   )
// }
//
