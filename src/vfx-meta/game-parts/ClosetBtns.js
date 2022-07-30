import { Text } from '@react-three/drei'
import { useMetaStore } from '../store/use-meta-store'
import { Fashion } from './ClosetAvatar'

export function ClosetBtns() {
  let setAvatar = useMetaStore((s) => s.setAvatar)
  return (
    <group>
      <group position={[-10, 0, 0]}>
        <Text
          rotation-x={Math.PI * -0.25}
          onClick={() => {
            //
            setAvatar({
              vendor: 'rpm',
              avatarURL: `/Metaverse/avatar/default-lok.glb`,
            })
          }}
          fontSize={1}
        >
          Ready Player Me (Lok)
        </Text>
      </group>
      <group position={[10, 0, 0]}>
        <Text
          rotation-x={Math.PI * -0.25}
          onClick={() => {
            //

            let avatarPartUpper = Fashion[0].uppers[0].url
            let avatarPartLower = Fashion[0].lowers[0].url
            let avatarPartShoes = Fashion[0].shoes[0].url

            setAvatar({
              vendor: 'closet',
              avatarPartUpper,
              avatarPartLower,
              avatarPartShoes,
            })
          }}
          fontSize={1}
        >
          Closet
        </Text>

        <group position={[-2.5, 0, 0]}>
          <Text
            rotation-x={Math.PI * -0.25}
            position={[0, 0, 1]}
            onClick={() => {
              //

              let avatarPartUpper = Fashion[0].uppers[0].url

              setAvatar({
                vendor: 'closet',
                avatarPartUpper,
              })
            }}
            fontSize={1}
          >
            Upper A
          </Text>
          <Text
            rotation-x={Math.PI * -0.25}
            position={[0, 0, 2]}
            onClick={() => {
              //

              let avatarPartLower = Fashion[0].lowers[0].url

              setAvatar({
                vendor: 'closet',
                avatarPartLower,
              })
            }}
            fontSize={1}
          >
            Lower A
          </Text>
          <Text
            rotation-x={Math.PI * -0.25}
            position={[0, 0, 3]}
            onClick={() => {
              //

              let avatarPartShoes = Fashion[0].shoes[0].url

              setAvatar({
                vendor: 'closet',
                avatarPartShoes,
              })
            }}
            fontSize={1}
          >
            Shoes A
          </Text>
        </group>

        <group position={[2.5, 0, 0]}>
          <Text
            rotation-x={Math.PI * -0.25}
            position={[0, 0, 1]}
            onClick={() => {
              //

              let avatarPartUpper = Fashion[0].uppers[1].url

              setAvatar({
                vendor: 'closet',
                avatarPartUpper,
              })
            }}
            fontSize={1}
          >
            Upper B
          </Text>
          <Text
            rotation-x={Math.PI * -0.25}
            position={[0, 0, 2]}
            onClick={() => {
              //

              let avatarPartLower = Fashion[0].lowers[1].url

              setAvatar({
                vendor: 'closet',
                avatarPartLower,
              })
            }}
            fontSize={1}
          >
            Lower B
          </Text>
          <Text
            rotation-x={Math.PI * -0.25}
            position={[0, 0, 3]}
            onClick={() => {
              //

              let avatarPartShoes = Fashion[0].shoes[1].url

              setAvatar({
                vendor: 'closet',
                avatarPartShoes,
              })
            }}
            fontSize={1}
          >
            Shoes B
          </Text>
        </group>
      </group>
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
    </group>
  )
}
