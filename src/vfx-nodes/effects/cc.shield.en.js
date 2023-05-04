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

  // data.uniforms.colorA((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     if (it.material) {
  //       it.material.color = new Color(v.value)
  //     }
  //   }
  // })

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

  let mesh = new Mesh(
    new SphereGeometry(0.15, 32, 32),
    new MeshPhysicalMaterial({
      transmission: 1,
      roughness: 0,
      thickness: 1.045,
      transparent: true,
      opacity: 0.85,
    })
  )

  it.geometry.computeBoundingSphere()
  let center = it.geometry.boundingSphere.center.clone()

  mesh.position.copy(center)
  mesh.position.x = 1

  let tt = 10
  for (let i = 0; i < tt; i++) {
    let gp = new Object3D()
    let clock = new Clock()
    let rot = new Object3D()
    rot.add(mesh.clone())
    rot.rotation.y = Math.PI * 2 * (i / tt)

    mini.onLoop(() => {
      let et = clock.getElapsedTime()
      rot.rotation.y = et * 0.5 + Math.PI * 2 * (i / tt)
    })
    gp.add(rot)

    mini.onClean(() => {
      mesh.removeFromParent()
    })

    mini.now.mounter.add(gp)

    gp.rotation.x = mini.now.mounter.rotation.x
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
