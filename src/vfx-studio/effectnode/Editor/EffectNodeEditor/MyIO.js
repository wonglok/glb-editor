import { RoundedBox } from '@react-three/drei'
import { Vector3 } from 'three140'
import { getID } from '@/vfx-runtime/ENUtils'
import { useENEditor } from '@/vfx-studio/store/use-en-editor'

export function MyIO({ io, idx, node, socket, e, total }) {
  let draggingIOID = useENEditor((s) => s.draggingIOID)
  let setDraggingIOID = useENEditor((s) => s.setDraggingIOID)
  let isDown = useENEditor((s) => s.isDown)
  let setDown = useENEditor((s) => s.setDown)

  let curosrPoint = useENEditor((s) => s.curosrPoint)
  let control = useENEditor((s) => s.control)
  let dragStartPos = useENEditor((s) => s.dragStartPos)

  let addLink = useENEditor((s) => s.addLink)

  let reloadGraph = useENEditor((s) => s.reloadGraph)
  //
  let v3 = new Vector3()
  let v3b = new Vector3()

  let orbit = total
  let radius = 1

  let theta = e * -Math.PI

  if (io === 'output') {
    theta = Math.PI * e
  } else if (io === 'input') {
  }

  theta -= (0.5 * (Math.PI * 2)) / total
  theta += Math.PI * 1.5

  v3.setFromCylindricalCoords(orbit, theta, 0)
  v3b.setFromCylindricalCoords(orbit + 4.5, theta, 0)

  v3.set(0, 0, 0)
  v3b.set(0, 0, 0)

  if (io === 'input') {
    v3.x = -5
    v3b.x = -5 + -3
  } else {
    v3.x = 5
    v3b.x = 5 + 3
  }
  v3.z = (idx - total / 4) * 4.5
  v3b.z = (idx - total / 4) * 4.5

  let scan = () => {
    if (
      draggingIOID &&
      draggingIOID.socket._id !== socket._id &&
      draggingIOID.node._id !== node._id &&
      draggingIOID.socket.type !== socket.type
    ) {
      //
      let pair = [{ node, socket }, { ...draggingIOID }]
      let input = pair.find((e) => e.socket.type === 'input')
      let output = pair.find((e) => e.socket.type === 'output')

      // console.log(input, output)
      // console.log(input, output);
      if (input && output) {
        return { input, output }
      }
    }
  }

  let onPointerDown = (e) => {
    control.enabled = false

    e.stopPropagation()
    e.target.setPointerCapture(e.pointerId)

    setDown(true)
    setDraggingIOID({
      socket: JSON.parse(JSON.stringify(socket)),
      node: JSON.parse(JSON.stringify(node)),
    })

    dragStartPos.copy(curosrPoint.position)
  }
  let onPointerUp = (e) => {
    control.enabled = true

    e.stopPropagation()
    e.target.releasePointerCapture(e.pointerId)
    // ENMethods.saveCodeBlock({ node });

    let res = scan()

    // console.log(res)
    if (res) {
      // ENMethods.addLink({
      //   input: res.input.socket,
      //   output: res.output.socket,
      // })

      let result = {
        _id: getID(),
        input: res.input.socket,
        output: res.output.socket,
      }

      addLink(result)
      reloadGraph()
    }

    setDown(false)
    setDraggingIOID(false)
  }
  let onPointerMove = () => {}

  return (
    <group>
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}

      {io === 'input' && (
        <mesh
          name={socket._id}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerMove={onPointerMove}
          //
          // args={[1, 1, 1]}
          // radius={1 / 5}
        >
          {/* <cylinderBufferGeometry
            args={[2 / 5, 2 / 5, 0.5, 32, 32]}
          ></cylinderBufferGeometry> */}
          <sphereBufferGeometry args={[2 / 5, 32, 32]}></sphereBufferGeometry>
          <meshStandardMaterial
            roughness={0.3}
            metalness={1}
            color={'lime'}
          ></meshStandardMaterial>
        </mesh>
      )}
      {io === 'output' && (
        <mesh
          name={socket._id}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerMove={onPointerMove}
          //
          // args={[1, 1, 1]}
          // radius={2 / 5}
        >
          {/* <cylinderBufferGeometry
            args={[2 / 5, 2 / 5, 0.5, 32, 32]}
          ></cylinderBufferGeometry> */}
          <sphereBufferGeometry args={[2 / 5, 32, 32]}></sphereBufferGeometry>

          <meshStandardMaterial
            roughness={0.3}
            metalness={1}
            color={'cyan'}
          ></meshStandardMaterial>
        </mesh>
      )}
    </group>
  )
}
