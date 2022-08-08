import { Sphere } from '@react-three/drei'
import { useMemo } from 'react'
import { Object3D } from 'three140'
import { OtherPlayerAvatarWrap } from '../game-parts/OtherPlayerAvatarWrap'

export function OtherOnePlayer({ otherPlayer }) {
  let targetO3D = useMemo(() => {
    let o3d = new Object3D()
    o3d.position.fromArray(otherPlayer.playerPosition)
    return o3d
  }, [otherPlayer])

  return (
    <>
      <OtherPlayerAvatarWrap
        speed={9}
        targetO3D={targetO3D}
        otherPlayer={otherPlayer}
      ></OtherPlayerAvatarWrap>
      {/*  */}

      {/*  */}
      {/*  */}
    </>
  )
}
