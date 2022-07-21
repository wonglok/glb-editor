import WASDMetaverse from '@/vfx-library/WASDMetaverse'
import { MapGame } from '@/vfx-library/WASDMetaverse/MapGame'
import { getID } from '@/vfx-runtime/ENUtils'

export async function nodeData({ defaultData, nodeID }) {
  return {
    ...defaultData,

    //
    inputs: [
      //
      { _id: getID(), type: 'input', nodeID },
    ],

    //
    outputs: [
      //
      { _id: getID(), type: 'output', nodeID },
    ],

    //
    uniforms: [
      {
        _id: getID(),
        nodeID,

        name: 'mapGLB',
        type: 'text',
        value: `/scene/dome/dome.glb`,
      },
    ],
  }
}

export async function effect({ mini, node, data }) {
  //

  data.uniforms.mapGLB((data) => {
    if (typeof data.value !== 'undefined') {
      let done = false
      if (!done) {
        done = true
        node.out0.pulse(
          <WASDMetaverse key={MapGame.key} mapURL={data.value}></WASDMetaverse>
        )
      }
    }
  })
}

//

//
