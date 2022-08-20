// import { useEffect } from 'react'
import {
  Box,
  OrbitControls,
  Text,
  useAnimations,
  useFBX,
  useGLTF,
} from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'
import { HDR } from './HDR'

// import { useRouter } from 'next/router'
// import { Color, MeshStandardMaterial, Object3D, SkinnedMesh } from 'three'
// import {
//   prune,
//   dedup,
//   resample,
//   textureResize,
// } from '@gltf-transform/functions'
// import { WebIO } from '@gltf-transform/core'
// import { DracoMeshCompression } from '@gltf-transform/extensions'

import { Core } from '@/vfx-core/Core'

// import { Core } from 'vfx/layout/Core'
export function AvatarPlace() {
  let time = useRef(0)

  useFrame(({ clock }) => {
    let t = clock.getElapsedTime()
    time.current = t
  })

  //
  return (
    <group>
      {/*  */}

      <AvatarContent></AvatarContent>
      <OrbitControls
        object-position={[0, 1.45, 2.5]}
        target={[0, 1.45, 0]}
      ></OrbitControls>
      <HDR></HDR>
    </group>
  )
}

function AvatarContent() {
  let avatarGroup = useRef()

  let exportGLB = ({ clips, group }) => {
    //
    //
    import('three/examples/jsm/exporters/GLTFExporter.js').then(
      ({ GLTFExporter }) => {
        const exporter = new GLTFExporter()
        const options = {
          binary: true,
          trs: false,

          onlyVisible: false,
          truncateDrawRange: false,
          binary: true,
          maxTextureSize: Infinity,
          animations: clips,
          // .filter((aa) => {
          //   return aa.name.indexOf('mixamo') === 0
          // })
          // .map((e) => {
          //   let a = e.clone()
          //   a.validate()

          //   return a
          // }),
          forceIndice: true,
          includeCustomExtensions: true,
        }

        let clonedObject = clone(group)
        clonedObject.traverse((it) => {
          if (it.userData.beforeMat) {
            delete it.userData.beforeMat
          }
        })

        // Parse the input and generate the glTF output
        exporter.parse(
          [clonedObject],
          // called when the gltf has been generated
          async function (gltf) {
            //

            // let { WebIO } = await import('@gltf-transform/core')

            // let { prune, dedup, resample, textureResize } = await import(
            //   '@gltf-transform/functions'
            // )

            // let { DracoMeshCompression } = await import(
            //   '@gltf-transform/extensions'
            // )

            // // let rawBlob = new Blob([gltf], {
            // //   type: 'application/octet-stream',
            // // })

            // // let rawUrl = URL.createObjectURL(rawBlob)

            // const io = new WebIO({
            //   mode: 'cors',
            //   cache: 'no-cache',
            // })

            // let glbDocument = await io.readBinary(new Uint8Array(gltf))
            // // // let glbDocument = await io.read(rawUrl)

            // // /**
            // //  * simple_pipeline.js
            // //  *
            // //  * Short example of an glTF optimization pipeline implemented with
            // //  * the glTF-Transform (https://gltf-transform.donmccurdy.com/) API.
            // //  * Other common problems — e.g. high vertex or draw counts — may
            // //  * require working in other tools, like gltfpack or Blender.
            // //  */

            // await glbDocument.transform(
            //   // Remove duplicate vertex or texture data, if any.
            //   dedup(),

            //   // Losslessly resample animation frames.
            //   resample(),

            //   // Remove unused nodes, textures, or other data.
            //   prune(),

            //   // Resize all textures to ≤1K.
            //   textureResize({ size: [512, 512] })
            // )

            // glbDocument
            //   .createExtension(DracoMeshCompression)
            //   .setRequired(true)
            //   .setEncoderOptions({
            //     method: DracoMeshCompression.EncoderMethod.EDGEBREAKER,
            //     encodeSpeed: 5,
            //     decodeSpeed: 5,
            //   })

            // let newBin = await io.writeBinary(glbDocument)
            // // let newBin = gltf

            let newFile = new Blob([gltf], {
              type: 'application/octet-stream',
            })

            let newURL = URL.createObjectURL(newFile)

            let ahr = document.createElement('a')
            ahr.href = newURL
            ahr.download = 'opsimitsedGLB.glb'
            ahr.click()
            //

            //
          },
          // called when there is an error in the generation
          function (error) {
            console.log(error, 'An error happened')
          },
          options
        )
      }
    )
  }

  const base = useGLTF('/skinning/female3-00/upper/upper_001.glb')

  let [skeleton, setSkeleton] = useState(false)
  useEffect(() => {
    base.scene.traverse((obj) => {
      if (obj.skeleton && !skeleton) {
        setSkeleton(obj)
      }
    })
  }, [])

  let [hips, setHips] = useState(false)
  useEffect(() => {
    base.scene.traverse((obj) => {
      if (obj && obj.isBone && obj.name.includes('Hips')) {
        setHips(obj)
      }
    })
  }, [])

  const motionFile = useFBX(`/skinning/female3-00/motion/silly-dance.fbx`)

  let avatarAnim = useAnimations(
    motionFile.animations,
    base.nodes.mixamorigHips
  )

  useFrame(({ clock }) => {
    let t = clock.getElapsedTime()
    avatarAnim.mixer.setTime(t)
  })

  useEffect(() => {
    avatarAnim.names.forEach((name) => {
      if (name.indexOf('mix') === 0) {
        avatarAnim.actions[name]?.play()
      }
    })
  }, [])

  //

  let uppers = [
    {
      name: 'a',
      url: '/skinning/female3-00/upper/upper_001.glb',
    },
    {
      name: 'b',
      url: '/skinning/female3-01/upper/upper.glb',
    },
  ]

  let lowers = [
    {
      name: 'a',
      url: '/skinning/female3-00/lower/lower_001.glb',
    },
    {
      name: 'b',
      url: '/skinning/female3-01/lower/lower.glb',
    },
  ]

  let shoes = [
    {
      name: 'a',
      url: '/skinning/female3-00/shoes/shoes_001.glb',
    },
    {
      name: 'b',
      url: '/skinning/female3-01/shoes/shoes.glb',
    },
  ]

  Core.react.upper
  Core.react.lower
  Core.react.shoes
  return (
    <group>
      <Text
        onClick={() => {
          exportGLB({
            group: avatarGroup.current,
            clips: motionFile.animations,
          })
        }}
        position-y={2}
      >
        Export
      </Text>

      {/*  */}
      {/*  */}
      {/*  */}

      <Buttons></Buttons>

      {skeleton && hips && (
        <group ref={avatarGroup}>
          <group>
            <group>
              <group name={'Armature'} rotation={[-Math.PI * 0.5, 0, 0]}>
                <primitive object={hips} />

                {uppers.map((e, i) => {
                  return (
                    Core.now.upper === e.name && (
                      <group key={e.url + i} fallback={null}>
                        <Generic
                          skeleton={base.nodes.hand.skeleton}
                          url={e.url}
                        ></Generic>
                      </group>
                    )
                  )
                })}

                {lowers.map((e, i) => {
                  return (
                    Core.now.lower === e.name && (
                      <group key={e.url + i} fallback={null}>
                        <Generic
                          skeleton={base.nodes.hand.skeleton}
                          url={e.url}
                        ></Generic>
                      </group>
                    )
                  )
                })}

                {shoes.map((e, i) => {
                  return (
                    Core.now.shoes === e.name && (
                      <group key={e.url + i} fallback={null}>
                        <Generic
                          skeleton={base.nodes.hand.skeleton}
                          url={e.url}
                        ></Generic>
                      </group>
                    )
                  )
                })}
              </group>
            </group>
          </group>
        </group>
      )}
    </group>
  )
}

function Generic({ skeleton, url }) {
  const { nodes, materials } = useGLTF(url)

  let skinnedMeshes = []
  for (let obj of Object.values(nodes)) {
    if (obj.isSkinnedMesh) {
      obj.skeleton = skeleton
      skinnedMeshes.push(obj)
    }
  }
  return (
    <group>
      {skinnedMeshes.map((it) => {
        return (
          <primitive
            frustumCulled={false}
            object={it}
            key={it.uuid}
          ></primitive>
        )
      })}
    </group>
  )
}

function Buttons() {
  useEffect(() => {
    setTimeout(() => {
      Core.now.upper = 'a'
      Core.now.lower = 'a'
      Core.now.shoes = 'a'
    })
  }, [])

  return (
    <>
      <Text
        position-x={-0.2}
        onClick={() => {
          Core.now.upper = 'a'
        }}
        position-y={2.45}
      >
        Upper A
      </Text>

      <Text
        position-x={0.2}
        onClick={() => {
          Core.now.upper = 'b'
        }}
        position-y={2.45}
      >
        Upper B
      </Text>

      <Text
        position-x={-0.2}
        onClick={() => {
          Core.now.lower = 'a'
        }}
        position-y={2.3}
      >
        Lower A
      </Text>

      <Text
        position-x={0.2}
        onClick={() => {
          Core.now.lower = 'b'
        }}
        position-y={2.3}
      >
        Lower B
      </Text>

      <Text
        position-x={-0.2}
        onClick={() => {
          Core.now.shoes = 'a'
        }}
        position-y={2.15}
      >
        Shoes A
      </Text>

      <Text
        position-x={0.2}
        onClick={() => {
          Core.now.shoes = 'b'
        }}
        position-y={2.15}
      >
        Shoes B
      </Text>
    </>
  )
}
