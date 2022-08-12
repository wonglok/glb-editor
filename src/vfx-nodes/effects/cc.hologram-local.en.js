import { getID } from '@/vfx-runtime/ENUtils'
import { Color, MeshPhysicalMaterial, MeshStandardMaterial } from 'three140'

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

      {
        id: getID(),
        nodeID,
        name: 'shader',
        type: `glsl`,
        value: `

float ratioA = abs(sin(vH * 700.0 + time * 25.0));
gl_FragColor.a = ratioA * 1.0;

`,
      },
    ],

    //
    shaders: [],

    //
  }
}

export function effect({ node, mini, data }) {
  let it = mini.now.itself

  data.uniforms.shader((v) => {
    if (v && typeof v.value !== 'undefined') {
      let mat = new MeshPhysicalMaterial({
        name: it.material.name,
        color: new Color('#00ff89'),
        map: it.material.map,
        normalMap: it.material.normalMap,
        metalnessMap: it.material.metalnessMap,
        roughnessMap: it.material.roughnessMap,
        transparent: true,
      })

      //
      mat.onBeforeCompile = (shader, renderer) => {
        // shader.fragmentShader = ``
        let atBeginV = `

          varying float vH;
      `
        let atEndV = `
          vH = transformed.y;
      `

        let atBeginF = `

          varying float vH;
          uniform float time;
        `

        let atEnd = `
              ${v.value}
          `
        //

        let t = { value: 0 }
        shader.uniforms.time = t

        if (mini) {
          mini.onLoop((dt) => {
            t.value += dt
          })
        }

        //
        //
        shader.vertexShader = shader.vertexShader.replace(
          `void main() {`,
          `${atBeginV.trim()}void main() {`
        )
        shader.vertexShader = shader.vertexShader.replace(
          `#include <fog_vertex>`,
          `#include <fog_vertex>${atEndV}`
        )
        shader.fragmentShader = `${atBeginF.trim()}\n${shader.fragmentShader}`
        shader.fragmentShader = shader.fragmentShader.replace(
          `#include <dithering_fragment>`,
          `#include <dithering_fragment>\n${atEnd.trim()}`
        )

        //
      }

      mat.customProgramCacheKey = () => v.value
      it.material = mat

      //
    }
  })

  data.uniforms.colorA((v) => {
    if (v && typeof v.value !== 'undefined') {
      if (it.material) {
        it.material.color = new Color(v.value)
      }
    }
  })

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

  // // mini.onLoop(() => {
  // //   mini.now.mounter.getWorldPosition(myItem.position)
  // // })

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
