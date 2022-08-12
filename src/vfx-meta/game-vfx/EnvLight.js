import { Environment, Lightformer } from '@react-three/drei'

export function EnvLight() {
  return (
    <Environment frames={1} resolution={1024}>
      <Lightformer
        intensity={20}
        rotation-x={Math.PI * -0.5}
        position={[0, 5, 0]}
        scale={[2, 2, 1]}
      />
      <Lightformer
        intensity={2}
        rotation-x={Math.PI / 2}
        position={[0, 4, -3]}
        scale={[10, 1, 1]}
      />
      <Lightformer
        intensity={2}
        rotation-x={Math.PI / 2}
        position={[0, 4, 0]}
        scale={[10, 1, 1]}
      />
      <Lightformer
        intensity={2}
        rotation-x={Math.PI / 2}
        position={[0, 4, 3]}
        scale={[10, 1, 1]}
      />
      <Lightformer
        intensity={2}
        rotation-x={Math.PI / 2}
        position={[0, 4, 6]}
        scale={[10, 1, 1]}
      />
      <Lightformer
        intensity={2}
        rotation-x={Math.PI / 2}
        position={[0, 4, 9]}
        scale={[10, 1, 1]}
      />
      <Lightformer
        intensity={2}
        rotation-y={Math.PI / 2}
        position={[-50, 2, 0]}
        scale={[100, 2, 1]}
      />
      <Lightformer
        intensity={2}
        rotation-y={-Math.PI / 2}
        position={[50, 2, 0]}
        scale={[100, 2, 1]}
      />

      {/* Ceiling */}
      {/* <Lightformer
        intensity={2}
        rotation-x={Math.PI / 2}
        position={[0, 4, -9]}
        scale={[10, 1, 1]}
      />


      {/* Sides */}
      {/* Key */}
      <Lightformer
        form='rect'
        color='#00ffff'
        intensity={5}
        scale={2}
        position={[0, 5, 0]}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />

      <Lightformer
        form='rect'
        color='#00ffff'
        intensity={5}
        scale={2}
        position={[-5, 5, 0]}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />

      <Lightformer
        form='rect'
        color='#00ffff'
        intensity={5}
        scale={2}
        position={[5, 5, 0]}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />

      <Lightformer
        form='rect'
        color='#00ffff'
        intensity={5}
        scale={2}
        position={[-5, 5, 5]}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />

      <Lightformer
        form='rect'
        color='#00ffff'
        intensity={5}
        scale={2}
        position={[5, 5, -5]}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />
    </Environment>
  )
}
