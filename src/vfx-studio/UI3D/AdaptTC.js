import { useEffect, useMemo, useRef } from 'react'
import { useAccessor } from '@/vfx-studio/store/use-accessor'
import { useFrame, useThree } from '@react-three/fiber'
import { HDRTex } from './HDRTex'
import {
  // FlyControls,
  // MapControls,
  // OrbitControls,
  Select,
  useAnimations,
  useFBO,
} from '@react-three/drei'
import {
  BoxBufferGeometry,
  BoxHelper,
  DoubleSide,
  Object3D,
  PlaneBufferGeometry,
} from 'three'
// import anime from 'animejs'
import { EffectNodeRuntime } from '../effectnode/Runtime/EffectNodeRuntime/EffectNodeRuntime'
import { Player } from '@/vfx-meta/game-parts/Player'
// import { OnlineSystem } from '@/vfx-meta/online/OnlineSystem'
import { useMetaStore } from '@/vfx-meta/store/use-meta-store'
import { Camera, Mesh, MeshBasicMaterial, Scene } from 'three140'
// import { EnvLight } from '@/vfx-meta/game-vfx/EnvLight'
import { useRender } from '@/vfx-meta/store/use-render'
import { useENEditor } from '../store/use-en-editor'
import { SceneTransformControl } from './SceneTransformControl'

export function AdaptTC({ node }) {
  let reloadGraphID = useENEditor((s) => s.reloadGraphID)

  let fakeScene = useMemo(() => new Scene(), [])

  let fbo = useFBO(512, 1024)

  let camQ = new Camera()
  camQ.position.z = 1

  let quad = useMemo(() => {
    return new Mesh(
      new PlaneBufferGeometry(2, 2),
      new MeshBasicMaterial({
        map: fbo.texture,
        side: DoubleSide,
        color: 0xff0000,
        transparent: true,
        transparent: 1,
      })
    )
  }, [fbo.texture])

  useFrame(({ gl, camera }) => {
    if (fakeScene?.children.length > 0 && fakeScene && camera) {
      //
      gl.setRenderTarget(fbo)
      gl.setClearAlpha(0)
      gl.clear()
      gl.render(fakeScene, camera)
      gl.setRenderTarget(null)
      gl.setClearAlpha(1)
      //

      gl.autoClear = false
      gl.render(quad, camQ)
      gl.autoClear = true
    }
  }, 10000)

  return (
    <>{<ENTCNode key={reloadGraphID} fakeScene={fakeScene} node={node} />}</>
  )
}

export function ENTCNode({ node, fakeScene }) {
  let graphData = node?.userData?.effectNode

  return (
    <>
      {graphData && (
        <GroupTCs
          fakeScene={fakeScene}
          node={node}
          graphData={graphData}
        ></GroupTCs>
      )}
      {/*  */}
      {node.children.map((it) => {
        return (
          <ENTCNode fakeScene={fakeScene} key={it.uuid} node={it}></ENTCNode>
        )
      })}
    </>
  )
}

function GroupTCs({ node, graphData, fakeScene }) {
  return (
    <>
      {graphData?.nodes.map((e) => {
        return (
          <TC key={e._id} fakeScene={fakeScene} node={node} nodeData={e}></TC>
        )
      })}
    </>
  )
}

function TC({ node, nodeData, fakeScene }) {
  let updateSelected = useAccessor((s) => s.updateSelected)

  let o3 = useMemo(() => {
    let o3 = new Object3D()

    if (nodeData) {
      let transformPosition = nodeData.uniforms.find(
        (e) => e.name === 'transformPosition'
      )

      if (transformPosition) {
        window.addEventListener('reload-node', ({}) => {
          if (o3.__disabled) {
            return
          }
          o3.position.set(
            transformPosition.value.x,
            transformPosition.value.y,
            transformPosition.value.z
          )
        })

        if (transformPosition.needsInit) {
          transformPosition.needsInit = false

          //
          o3.position.copy(node.position)

          transformPosition.value.x = node.position.x
          transformPosition.value.y = node.position.y
          transformPosition.value.z = node.position.z
        } else {
          //
          //
          o3.position.set(
            transformPosition.value.x,
            transformPosition.value.y,
            transformPosition.value.z
          )
        }
      }

      let transformScale = nodeData.uniforms.find(
        (e) => e.name === 'transformScale'
      )

      if (transformScale) {
        window.addEventListener('reload-node', ({}) => {
          if (o3.__disabled) {
            return
          }
          o3.scale.set(
            transformScale.value.x,
            transformScale.value.y,
            transformScale.value.z
          )
        })

        if (transformScale.needsInit) {
          transformScale.needsInit = false

          //
          o3.scale.copy(node.scale)

          transformScale.value.x = node.scale.x
          transformScale.value.y = node.scale.y
          transformScale.value.z = node.scale.z
        } else {
          //
          //
          o3.scale.set(
            transformScale.value.x,
            transformScale.value.y,
            transformScale.value.z
          )
        }
      }

      let transformRotation = nodeData.uniforms.find(
        (e) => e.name === 'transformRotation'
      )

      if (transformRotation) {
        window.addEventListener('reload-node', ({}) => {
          if (o3.__disabled) {
            return
          }
          o3.rotation.set(
            transformRotation.value.x,
            transformRotation.value.y,
            transformRotation.value.z
          )
        })

        if (transformRotation.needsInit) {
          transformRotation.needsInit = false

          //
          o3.rotation.x = node.rotation.x
          o3.rotation.y = node.rotation.y
          o3.rotation.z = node.rotation.z

          transformRotation.value.x = node.rotation.x
          transformRotation.value.y = node.rotation.y
          transformRotation.value.z = node.rotation.z
        } else {
          //
          //
          o3.rotation.set(
            transformRotation.value.x,
            transformRotation.value.y,
            transformRotation.value.z,
            'XYZ'
          )
        }
      }
    }

    return o3
  }, [node, nodeData])

  useEffect(() => {
    return () => {
      o3.__disabled = true
    }
  }, [o3])

  //

  let tt = 0
  return (
    <>
      {nodeData.uniforms.some((e) => e.name === 'transformPosition') && (
        <SceneTransformControl
          fakeScene={fakeScene}
          object={o3}
          onChange={(o3) => {
            //
            let pos = nodeData.uniforms.find(
              (e) => e.name === 'transformPosition'
            )

            pos.value.x = o3.position.x
            pos.value.y = o3.position.y
            pos.value.z = o3.position.z

            let rot = nodeData.uniforms.find(
              (e) => e.name === 'transformRotation'
            )

            rot.value.x = o3.rotation.x
            rot.value.y = o3.rotation.y
            rot.value.z = o3.rotation.z

            let scale = nodeData.uniforms.find(
              (e) => e.name === 'transformScale'
            )

            scale.value.x = o3.scale.x
            scale.value.y = o3.scale.y
            scale.value.z = o3.scale.z

            window.dispatchEvent(
              new CustomEvent('reload-gui-value', { detail: nodeData })
            )

            clearTimeout(tt)
            tt = setTimeout(() => {
              updateSelected([node])
            }, 100)
            //
          }}
        ></SceneTransformControl>
      )}
    </>
  )
}

//
/*
{node && node.userData?.effectNode && (
        <SceneTransformControl object={o3}></SceneTransformControl>
      )}

let o3 = useMemo(() => {
    let o3 = new Object3D()

    if (!graphData) {
      return o3
    }

    if (graphData) {
      let position = nodeData.uniforms.find((e) => e.name === 'position')
      if (position) {
        o3.position.copy(position.value)
      }
      let rotation = nodeData.uniforms.find((e) => e.name === 'rotation')
      if (rotation) {
        o3.rotation.x = rotation.value.x
        o3.rotation.y = rotation.value.y
        o3.rotation.z = rotation.value.z
      }

      //
      let scale = nodeData.uniforms.find((e) => e.name === 'scale')
      if (scale) {
        o3.scale.copy(scale.value)
      }
      //
      // o3.position.copy()

      return o3
    }
  }, [graphData])
*/
