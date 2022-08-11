import { getID } from '@/vfx-runtime/ENUtils'
import { Color, MeshStandardMaterial } from 'three140'

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
      {
        id: getID(),
        nodeID,
        name: 'shader',
        type: `glsl`,
        value: `



  noiser = vec3(
    rand(uv.xy + 0.1) * 2.0 - 1.0,
    rand(uv.xy + 0.2) * 2.0 - 1.0,
    rand(uv.xy + 0.3) * 2.0 - 1.0
  );

  toBall(noiser, az, el);

  az += sin(time + uv.x * 3.14);
  el += cos(time + uv.x * 3.14);

  pos.xyz = trackerPos + vec3(0.0, 1.0, 0.0) + rotateY(time) * fromBall(2.9 + 0.5 * sin(time), az, el);

  gl_FragColor.rgb = pos.rgb;
  gl_FragColor.w = 1.0;

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

  if (it.material) {
    it.material = new MeshStandardMaterial({
      name: it.material.name,
      uuid: it.material.uuid,
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
