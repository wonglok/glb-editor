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


    //
float scaler = 1.0 / 350.0 * 3.14159264 * 2.0;
vec3 mpos = pos.xyz * scaler;

vec3 reso = vec3(1.0, 1.0, 1.0);
float radius = 20.0;
float angle = 12.0;
vec3 center = vec3(0.0);

float az = uv.x;
float el = uv.y;

toBall(mpos.xyz, az, el);
pos.xyz = fromBall(350.0, az, el);

float mytime = abs(sin(pos.x + pos.z + pos.y + time * 5.0)) * 3.141592;

az += sin(mytime + rand(time + pos.xy) + time);
el += cos(mytime + rand(time + pos.yz) + time);

// pos.xyz += fromBall(2.0, az, el);
// pos.xyz = fromBall(350.0, az, el);

pos.xyz = rotateQ(normalize(mpos.xyz * sin(mpos + mod(mytime, 1.0))), mod(mytime * 0.0065, 1.0)) * pos.xyz;
pos.xyz = rotateQ(normalize(vec3(1.0, sin(mytime), 1.0)), mod(mytime * 0.0065, 1.0)) * pos.xyz;

//
// pos.x += 1.0 * (rand(pos.xy + 0.1 + time) * 2.0 - 1.0);
// pos.y += 1.0 * (rand(pos.xy + 0.2 + time) * 2.0 - 1.0);
// pos.z += 1.0 * (rand(pos.xy + 0.3 + time) * 2.0 - 1.0);
//



`,
      },
    ],

    //
    shaders: [],

    //
  }
}

export function effect({ node, mini, data }) {
  let myItem = new TheVortex({ enableDetection: true })

  myItem.scale.setScalar(0.03)
  mini.now.mounter.add(myItem)
  mini.onClean(() => {
    myItem.removeFromParent()
  })

  //

  data.uniforms.shader((v) => {
    if (v && typeof v.value !== 'undefined') {
      myItem.shader = v.value
    }
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
