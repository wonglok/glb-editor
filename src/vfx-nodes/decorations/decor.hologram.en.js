import { list } from 'postcss'
import { Color, MeshPhysicalMaterial } from 'three'
import { MeshBasicMaterial, MeshStandardMaterial, Object3D } from 'three140'
import { getID } from '@/vfx-runtime/ENUtils'
import { Core } from '@/vfx-core/Core'

//

let applyHologram = ({ avatar, sub }) => {
  avatar.traverse((it) => {
    if (it.material && !it.userData.oMat) {
      it.userData.oMat = it.material.clone()
      it.userData.oMat.name = it.material.name
    }
  })

  console.log(avatar)
  avatar.traverse((it) => {
    if (it.material) {
      it.material = new MeshPhysicalMaterial({
        name: it.userData.oMat.name,
        color: it.userData.oMat.color,
        transmission: 0.98,
        ior: 1.3,
        thickness: 1,
        roughness: 0.2,
        metalness: 0.5,
        emissive: new Color('#010101'),
        flatShading: false,
        map: it.userData.oMat.map,
        normalMap: it.userData.oMat.normalMap,
        envMapIntensity: 0.0,
      })
      it.userData.enableBloom = true
      it.material.onBeforeCompile = (shader, renderer) => {
        // shader.fragmentShader = ``
        let atBeginV = `

          varying float vH;
      `
        let atEndV = `
          vH = transformed.z;
      `

        let atBeginF = `

          varying float vH;
            uniform float time;
      `

        let atEnd = `
            float ratioA = abs(sin(vH * 380.0 + time * -10.0));
            float ratioB = abs(sin(vH * 20.0 + time * -10.0));
            float ratioC = abs(sin(vH * 10.0 + time * -10.0));
            gl_FragColor.rgb *= ratioB * ratioA * vec3(1.0, 1.0, 1.0);

            gl_FragColor.rgb *= ratioC;

            gl_FragColor.rgb *= rand(vec2(time)) * 30.0;
            gl_FragColor.a = ratioA;
      `

        let t = { value: 0 }
        shader.uniforms.time = t

        if (sub) {
          sub.onLoop((dt) => {
            t.value += dt
          })
        }
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
      }
    }
  })
}

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
        value: '#ef05ba',
      },
      {
        _id: getID(),
        nodeID,

        name: 'colorB',
        type: 'color',
        value: '#02ffe0',
      },
      {
        _id: getID(),
        nodeID,

        name: 'colorC',
        type: 'color',
        value: '#ffffff',
      },
    ],

    //
    shaders: [],
  }
}

export async function effect({ node, mini, data }) {
  //
  /** @type {Scene} */
  let scene = await Core.ready.canvas.then((c) => c.ready.scene)

  let waitForOne = async (oName) => {
    let obj = await new Promise((resolve) => {
      let tt = setInterval(() => {
        scene.traverse((it) => {
          if (it.name === oName) {
            clearInterval(tt)
            resolve(it)
          }
        })
      })
    })
    return obj
  }

  let waitForOneMat = async (oName) => {
    let obj = await new Promise((resolve) => {
      let tt = setInterval(() => {
        scene.traverse((it) => {
          if (it.material && it.material.name === oName) {
            clearInterval(tt)
            resolve(it)
          }
        })
      })
    })
    return obj
  }

  let waitForListMat = async (oName, min = 0) => {
    let list = await new Promise((resolve) => {
      let arr = []
      let tt = setInterval(() => {
        scene.traverse((it) => {
          if (
            it &&
            it.material &&
            it.material.name &&
            it.material.name.indexOf(oName) !== -1
          ) {
            arr.push(it)
            // console.log(it.material.name)
          }
        })
        if (arr.length > min) {
          resolve(arr)
          clearInterval(tt)
        }
      }, 1)
    })
    return list
  }

  let waitForList = async (oName, min = 0) => {
    let list = await new Promise((resolve) => {
      let arr = []
      let tt = setInterval(() => {
        scene.traverse((it) => {
          if (it && it.name.indexOf(oName) !== -1) {
            arr.push(it)
          }
        })
        if (arr.length > min) {
          resolve(arr)
          clearInterval(tt)
        }
      }, 1)
    })
    return list
  }

  // let bottls = await waitForOne('FX_Bottle')

  let fxMatsObjs = await waitForListMat('FX', 2)

  fxMatsObjs
    .filter((it) => it.type === 'Mesh')
    .forEach((it) => {
      if (it.material) {
        it.material = new MeshStandardMaterial({
          color: new Color('#ffffff'),
          transparent: true,
        })
        it.material.onBeforeCompile = (shader, renderer) => {
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
            float ratioA = abs(sin(vH * 380.0 + time * -10.0));
            float ratioB = abs(sin(vH * 320.0 + time * -10.0));
            float ratioC = abs(sin(vH * 310.0 + time * -10.0));
            gl_FragColor.rgb *= ratioB * ratioA * vec3(1.0, 1.0, 1.0);

            gl_FragColor.rgb *= ratioC;

            gl_FragColor.rgb *= rand(vec2(time)) * 30.0;
            gl_FragColor.a = ratioA * 0.5;
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
        }
      }
    })

  let girls = await waitForList('FX_Fouintain_Girl', 2)
  girls
    .filter((it) => it.type === 'Mesh')
    .forEach((it) => {
      //

      if (it.material) {
        it.material = new MeshStandardMaterial({
          color: new Color('#FF8F3B'),
          transparent: true,
        })
        it.material.onBeforeCompile = (shader, renderer) => {
          // shader.fragmentShader = ``
          let atBeginV = `

            varying float vH;
        `
          let atEndV = `
            vH = transformed.z * transformed.x;
        `

          let atBeginF = `

            varying float vH;
              uniform float time;
        `

          let atEnd = `
              float ratioA = abs(sin(vH * 380.0 + time * -10.0));
              float ratioB = abs(sin(vH * 20.0 + time * -10.0));
              float ratioC = abs(sin(vH * 10.0 + time * -10.0));
              gl_FragColor.rgb *= ratioB * ratioA * vec3(1.0, 1.0, 1.0);

              gl_FragColor.rgb *= ratioC;

              gl_FragColor.rgb *= rand(vec2(time)) * 30.0;
              gl_FragColor.a = ratioA * 0.5;
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
        }
      }
    })

  //

  //

  let FX_Neon_Fountain = await waitForOneMat(`FX_Neon_Fountain`)
  // let bottls = await waitForOne('FX_Bottle')
  let list2 = []
  list2.push(FX_Neon_Fountain)
  list2.forEach((it) => {
    //
    console.log(it)
    if (it.material) {
      it.material = new MeshStandardMaterial({
        color: new Color('#FF8F3B'),
        transparent: true,
      })
      it.material.onBeforeCompile = (shader, renderer) => {
        // shader.fragmentShader = ``
        let atBeginV = `

            varying float vH;
        `
        let atEndV = `
            vH = (transformed.y) / 3.0 * 0.5 * 0.5;
        `

        let atBeginF = `

            varying float vH;
              uniform float time;
        `

        let atEnd = `
              float ratioA = abs(sin(vH * 20.0 + time * 0.1 * -10.0));
              float ratioB = abs(sin(vH * 20.0 + time * 0.1 * -10.0));
              float ratioC = abs(sin(vH * 10.0 + time * 0.1 * -10.0));
              gl_FragColor.rgb *= ratioB * ratioA * vec3(1.0, 1.0, 1.0);

              gl_FragColor.rgb *= ratioC;

              gl_FragColor.rgb *= rand(vec2(time * 0.1)) * 30.0;
              gl_FragColor.a = ratioA * 0.5;
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
      }
    }
  })

  //

  //

  //

  //
  //
  //
  //
  // let myStarSky = new StarSky({})
  // data.uniforms.speed((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     myStarSky.speed = v.value
  //   }
  // })
  // data.uniforms.colorA((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     myStarSky.colorA = v.value
  //   }
  // })
  // data.uniforms.colorB((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     myStarSky.colorB = v.value
  //   }
  // })
  // data.uniforms.colorC((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     myStarSky.colorC = v.value
  //   }
  // })
  // node.out0.pulse(myStarSky)
}

//

//
