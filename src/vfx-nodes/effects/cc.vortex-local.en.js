import { TheVortex } from '@/vfx-library/TheVortex/TheVortex'
import { getID } from '@/vfx-runtime/ENUtils'

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
  let myItem = new TheVortex({
    enableDetection: true,
    tracker: mini.now.mounter,
  })

  //

  //
  mini.now.scene.add(myItem)
  mini.onClean(() => {
    myItem.removeFromParent()
  })
  // mini.onLoop(() => {
  //   mini.now.mounter.getWorldPosition(myItem.position)
  // })

  //

  data.uniforms.shader((v) => {
    if (v && typeof v.value !== 'undefined') {
      myItem.shader = v.value
    }
  })

  mini.onLoop(() => {
    myItem.traverse((it) => {
      it.frustumCulled = false
    })
  })
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
