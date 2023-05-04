import { getID } from '@/vfx-runtime/ENUtils'
import { BoxGeometry, Clock, Mesh, Object3D, Vector3 } from 'three'
import {
  Color,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SphereGeometry,
} from 'three140'

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
    ],

    // at least 1
    //
    outputs: [
      //
      { _id: getID(), type: 'output', nodeID },
      { _id: getID(), type: 'output', nodeID },
      { _id: getID(), type: 'output', nodeID },
    ],

    //
    material: [],

    uniforms: [
      {
        _id: getID(),
        nodeID,

        name: 'speed',
        type: 'float',
        value: 1,
      },
      {
        _id: getID(),
        nodeID,

        name: 'colorA',
        type: 'color',
        value: '#00ff89',
      },

      //       {
      //         id: getID(),
      //         nodeID,
      //         name: 'shader',
      //         type: `glsl`,
      //         value: `

      // float ratioA = abs(cos(250.0 * vH + time * 25.0) * sin(vH * 250.0 + time * 25.0));
      // gl_FragColor.a = ratioA * 1.0;
      // `,
      //       },
    ],

    //
  }
}

export function effect({ node, mini, data }) {
  let it = mini.now.itself

  console.log(it)

  // data.uniforms.shader((v) => {
  //   console.log(v.value)
  // })

  //
  // if (it.material) {
  // }

  // let myItem = new TheVortex({
  //   enableDetection: true,
  //   tracker: mini.now.mounter,
  // })

  // //

  // //
  // mini.now.scene.add(myItem)
  // mini.onClean(() => {
  //   myItem.removeFromParent()
  // })

  //

  let run = (initY = 0) => {
    let mesh = new Mesh(
      new SphereGeometry(0.3, 32, 32),
      new MeshPhysicalMaterial({
        transmission: 1,
        roughness: 0,
        thickness: 1.645,
        transparent: true,
        opacity: 0.85,
      })
    )
    let clock = new Clock()
    let rotRoot = new Object3D()
    rotRoot.rotation.y = initY || 0
    mini.onLoop(() => {
      let dt = clock.getDelta()
      rotRoot.rotation.y += 1.1 * dt
    })
    let fly = new Object3D()
    fly.position.x = 1

    fly.add(mesh)
    rotRoot.add(fly)

    rotRoot.rotation.x = Math.PI * 0.5

    fly.position.y = 1.2

    it.add(rotRoot)
    mini.onClean(() => {
      mesh.removeFromParent()
    })

    data.uniforms.colorA((v) => {
      if (v && typeof v.value !== 'undefined') {
        if (mesh.material) {
          mesh.material.color = new Color(v.value)
        }
      }
    })
  }

  for (let i = 0; i < 5; i++) {
    run((i / 5) * Math.PI * 2.0)
  }

  //

  // //

  // data.uniforms.shader((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     myItem.shader = v.value
  //   }
  // })

  // mini.onLoop(() => {
  //   myItem.traverse((it) => {
  //     it.frustumCulled = false
  //   })
  // })
  // data.uniforms.colorA((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     myItem.colorA = v.value
  //   }
  // })

  // data.uniforms.colorB((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     myItem.colorB = v.value
  //   }
  // })

  // data.uniforms.colorC((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     myItem.colorC = v.value
  //   }
  // })

  // node.out0.pulse(myItem)
}

//

//
