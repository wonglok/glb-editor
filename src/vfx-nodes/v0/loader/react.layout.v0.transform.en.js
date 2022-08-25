import { getID } from '@/vfx-runtime/ENUtils'
import { createPortal } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Object3D } from 'three140'

//

export async function nodeData({ defaultData, nodeID }) {
  return {
    ...defaultData,

    //
    //
    inputs: [
      //
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
    ],

    // at least 1
    //
    outputs: [
      //
      { _id: getID(), type: 'output', nodeID },
    ],

    //
    material: [],

    //
    uniforms: [
      {
        _id: getID(),
        nodeID,
        protected: true,
        name: 'transformPosition',
        type: 'vec3',
        needsInit: true,
        value: { x: 0, y: 0, z: 0 },
      },
      {
        _id: getID(),
        nodeID,
        protected: true,
        name: 'transformScale',
        type: 'vec3',
        needsInit: true,

        value: { x: 1, y: 1, z: 1 },
      },
      {
        _id: getID(),
        nodeID,
        protected: true,
        name: 'transformRotation',
        type: 'vec3',
        needsInit: true,
        value: { x: 0, y: 0, z: 0 },
      },
      {
        _id: getID(),
        nodeID,
        protected: true,
        name: 'useTranslate',
        type: 'button',
        needsInit: true,
        value: { x: 0, y: 0, z: 0 },
      },
      {
        _id: getID(),
        nodeID,
        protected: true,
        name: 'useRotation',
        type: 'button',
        needsInit: true,
        value: { x: 0, y: 0, z: 0 },
      },
      {
        _id: getID(),
        nodeID,
        protected: true,
        name: 'useScale',
        type: 'button',
        needsInit: true,
        value: { x: 0, y: 0, z: 0 },
      },
    ],

    //
    shaders: [],

    //
  }
}

// let rtt = new WebGLRenderTarget(512, 1024)

// let renderToTarget = (gl, scene, camera) => {
//   gl.setRenderTarget(rtt)
//   gl.setClearAlpha(0)
//   gl.clear()
//   gl.render(scene, camera)
//   gl.setClearAlpha(1)
//   gl.setRenderTarget(null)
// }

function Inbound({ socketName, data, node, mini }) {
  let [item, setItem] = useState(null)

  useEffect(() => {
    node[socketName].ready.then((v) => {
      setItem(v)
    })
    node[socketName].stream((v) => {
      setItem(v)
    })

    return () => {
      //
    }
  }, [mini, node, socketName])

  return <group>{item}</group>
}

function Parent({ node, data, mini }) {
  let ref = useRef()

  useEffect(() => {
    mini.onLoop(() => {
      let o3d = ref.current

      if (!o3d) {
        return
      }

      if (o3d && data.value.transformPosition) {
        o3d.position.copy(data.value.transformPosition)
      }
      if (o3d && data.value.transformRotation) {
        o3d.rotation.x = data.value.transformRotation.x
        o3d.rotation.y = data.value.transformRotation.y
        o3d.rotation.z = data.value.transformRotation.z
      }
      if (o3d && data.value.transformScale) {
        o3d.scale.copy(data.value.transformScale)
      }
    })

    //
  })

  return (
    <group ref={ref}>
      <Inbound socketName={'in0'} node={node} data={data} mini={mini}></Inbound>
      <Inbound socketName={'in1'} node={node} data={data} mini={mini}></Inbound>
      <Inbound socketName={'in2'} node={node} data={data} mini={mini}></Inbound>
      <Inbound socketName={'in3'} node={node} data={data} mini={mini}></Inbound>
      <Inbound socketName={'in4'} node={node} data={data} mini={mini}></Inbound>
      <Inbound socketName={'in5'} node={node} data={data} mini={mini}></Inbound>
      <Inbound socketName={'in6'} node={node} data={data} mini={mini}></Inbound>
      <Inbound socketName={'in7'} node={node} data={data} mini={mini}></Inbound>
      <Inbound socketName={'in8'} node={node} data={data} mini={mini}></Inbound>
      <Inbound socketName={'in9'} node={node} data={data} mini={mini}></Inbound>
    </group>
  )
}

export function effect({ node, mini, data, setComponent }) {
  // Inbound

  let item = <Parent node={node} mini={mini} data={data}></Parent>

  node.out0.pulse(item)

  let tt = setInterval(() => {
    node.out0.pulse(item)
  }, 100)

  mini.onLoop(() => {
    clearInterval(tt)
  })

  //

  //
  // let send = () => {
  //   node.out0.pulse(
  //     createPortal(
  //       ,
  //       o3d
  //     )
  //   )
  // }
  //

  //
  // data.uniforms.transformPosition((sig) => {
  //   send()
  // })
  // data.uniforms.transformRotation((sig) => {
  //   send()
  // })
  // data.uniforms.transformScale((sig) => {
  //   send()
  // })
  //

  //

  //
  // setComponent(
  // )

  //
  // setComponent
  //
  // let receivers = {}
  // let MakeElemnet = () => {
  //   let ref = useRef()
  //   let values = []
  //   for (let socketInputName in receivers) {
  //     if (receivers[socketInputName]) {
  //       values.push(receivers[socketInputName])
  //     }
  //   }
  //   useEffect(() => {
  //     if (ref.current) {
  //       ref.current.visible = false
  //     }
  //     let tt = setInterval(() => {
  //       if (ref.current) {
  //         ref.current.visible = true
  //       }
  //       if (ref.current && data.value.transformPosition) {
  //         ref.current.position.copy(data.value.transformPosition)
  //       }
  //       if (ref.current && data.value.transformRotation) {
  //         ref.current.rotation.x = data.value.transformRotation.x
  //         ref.current.rotation.y = data.value.transformRotation.y
  //         ref.current.rotation.z = data.value.transformRotation.z
  //       }
  //       if (ref.current && data.value.transformScale) {
  //         ref.current.scale.copy(data.value.transformScale)
  //       }
  //     })
  //     return () => {
  //       clearInterval(tt)
  //     }
  //   })
  //   //
  //   // console.log(defaultConfig)
  //   //
  //   // console.log(data.value.rotation)
  //   return <group ref={ref}>{values}</group>
  // }
  // let send = () => {
  //   node.out0.pulse(<MakeElemnet key={getID()}></MakeElemnet>)
  // }
  // let keys = ['in0', 'in1', 'in2', 'in3', 'in4', 'in5', 'in6', 'in7', 'in8']
  // keys.forEach((socket) => {
  //   receivers[socket] = null
  //   node[socket].stream((v) => {
  //     receivers[socket] = v
  //     send()
  //   })
  // })
  // data.uniforms.position((sig) => {
  //   setTimeout(() => {
  //     send()
  //   })
  // })
  // data.uniforms.rotation((sig) => {
  //   setTimeout(() => {
  //     send()
  //   })
  // })
  // data.uniforms.scale((sig) => {
  //   setTimeout(() => {
  //     send()
  //   })
  // })
  //
  //
  //
  // //
  // //
  // //
  // // //
  // // keys.forEach((kn) => {
  // //   console.log(data.value[kn])
  // //   defaultConfig[kn] = data.value[kn] || null
  // // })
  // let tc = new TransformControls(mini.now.camera, mini.now.gl.domElement, {
  //   mode: 'trasnlate',
  // })
  // tc.addEventListener('dragging-changed', (ev) => {
  //   let ctrl = useMetaStore.getState().controls
  //   if (ctrl) {
  //     ctrl.enabled = !ev.value
  //   }
  // })
  // tc.addEventListener('change', (ev) => {
  //   // quad.needsUpdate = true
  //   console.log(ev.target)
  //   data.value.position.x = o3.position.x
  //   data.value.position.y = o3.position.y
  //   data.value.position.z = o3.position.z
  //   window.dispatchEvent(new CustomEvent('reload-node', { detail: data.raw }))
  //   send()
  // })
  // let camQ = new Camera()
  // camQ.position.z = 1
  // let quad = new Mesh(
  //   new PlaneBufferGeometry(2, 2),
  //   new MeshBasicMaterial({
  //     map: rtt.texture,
  //     side: DoubleSide,
  //     color: 0xffffff,
  //     transparent: true,
  //     transparent: 1,
  //   })
  // )
  // let o3 = new Object3D()
  // tc.attach(o3)
  // //
  // let myScene = new Scene()
  // myScene.add(o3)
  // myScene.add(tc)
  // mini.onClean(() => {
  //   tc.removeFromParent()
  //   o3.removeFromParent()
  // })
  // mini.onLoop(() => {
  //   if (mini.isPaused) {
  //     return
  //   }
  //   renderToTarget(mini.now.gl, myScene, mini.now.camera)
  //   mini.now.gl.autoClear = false
  //   mini.now.gl.render(quad, camQ)
  //   mini.now.gl.autoClear = true
  // })
  //
}

//

/*
<Noise premultiply={true} opacity={0.2} />

<SSR {...props} />
<Bloom
  luminanceThreshold={0.2}
  mipmapBlur
  luminanceSmoothing={0}
  intensity={0.5}
/>
<LUT lut={texture} />
{/* <DepthOfField
    focusDistance={2}
    focalLength={0.02}
    bokehScale={2}
    height={480}
  />
  */
