import { getID } from '@/vfx-runtime/ENUtils'
import { useEffect, useRef } from 'react'

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
        name: 'transformPosition',
        type: 'vec3',
        needsInit: true,
        value: { x: 0, y: 0, z: 0 },
      },
      {
        _id: getID(),
        nodeID,
        name: 'transformScale',
        type: 'vec3',
        needsInit: true,

        value: { x: 1, y: 1, z: 1 },
      },
      {
        _id: getID(),
        nodeID,
        name: 'transformRotation',
        type: 'vec3',
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

export function effect({ node, mini, data, setComponent }) {
  //
  // setComponent
  //

  let receivers = {}

  let MakeElemnet = () => {
    let ref = useRef()

    let values = []

    for (let socketInputName in receivers) {
      if (receivers[socketInputName]) {
        values.push(receivers[socketInputName])
      }
    }

    let defaultConfig = {
      position: [
        data.value.transformPosition.x,
        data.value.transformPosition.y,
        data.value.transformPosition.z,
      ],
      rotation: [
        data.value.transformRotation.x,
        data.value.transformRotation.y,
        data.value.transformRotation.z,
      ],
      scale: [
        //
        data.value.transformScale.x,
        data.value.transformScale.y,
        data.value.transformScale.z,
      ],
    }

    useEffect(() => {
      let tt = setInterval(() => {
        if (ref.current && data.value.transformPosition) {
          ref.current.position.copy(data.value.transformPosition)
        }
        if (ref.current && data.value.transformRotation) {
          ref.current.rotation.copy(data.value.transformRotation)
        }
        if (ref.current && data.value.transformScale) {
          ref.current.scale.copy(data.value.transformScale)
        }
      })

      return () => {
        clearInterval(tt)
      }
    })
    //
    // console.log(defaultConfig)
    //
    // console.log(data.value.rotation)

    return <group ref={ref}>{values}</group>
  }

  let send = () => {
    node.out0.pulse(<MakeElemnet key={getID()}></MakeElemnet>)
  }

  let keys = ['in0', 'in1', 'in2', 'in3', 'in4', 'in5', 'in6', 'in7', 'in8']

  keys.forEach((socket) => {
    receivers[socket] = null
    node[socket].stream((v) => {
      receivers[socket] = v
      send()
    })
  })

  data.uniforms.position((sig) => {
    setTimeout(() => {
      send()
    })
  })
  data.uniforms.rotation((sig) => {
    setTimeout(() => {
      send()
    })
  })
  data.uniforms.scale((sig) => {
    setTimeout(() => {
      send()
    })
  })

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
