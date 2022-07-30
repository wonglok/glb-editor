import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Camera } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { AnimationMixer } from 'three140'
import { DRACOLoader } from 'three140/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three140/examples/jsm/loaders/GLTFLoader'

export let Fashion = [
  {
    name: 'basic',
    uppers: [
      {
        name: 'a',
        url: '/skinning/female3-00/upper/upper_001.glb',
      },
      {
        name: 'b',
        url: '/skinning/female3-01/upper/upper.glb',
      },
    ],
    lowers: [
      {
        name: 'a',
        url: '/skinning/female3-00/lower/lower_001.glb',
      },
      {
        name: 'b',
        url: '/skinning/female3-01/lower/lower.glb',
      },
    ],
    shoes: [
      {
        name: 'a',
        url: '/skinning/female3-00/shoes/shoes_001.glb',
      },
      {
        name: 'b',
        url: '/skinning/female3-01/shoes/shoes.glb',
      },
    ],
    motions: [
      {
        name: 'sillydance',
        url: `/skinning/female3-00/motion/silly-dance.fbx`,
      },
    ],
  },
]

export function ClosetAvatar({
  //]
  avatarActionName = 'stand',
  avatarActionResumeOnKeyUp = 'stand',
  avatarActionRepeat = Infinity,

  avatarPartUpper = Fashion[0].uppers[0].url,
  avatarPartLower = Fashion[0].lowers[0].url,
  avatarPartShoes = Fashion[0].shoes[0].url,

  //
}) {
  let gl = useThree((s) => s.gl)
  let camera = useThree((s) => s.camera)
  let avatarGroup = useRef()

  let [skeleton, setSkeleton] = useState(false)
  let [hips, setHips] = useState(false)
  let [base, setBase] = useState(false)

  let [mixer, setMixer] = useState(() => {
    return new AnimationMixer()
  })

  useFrame((st, dt) => {
    mixer.update(dt)
  })

  //
  useEffect(() => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')

    let fbxLoader = new FBXLoader()

    let get = (v) => {
      let loader = new GLTFLoader()
      loader.setDRACOLoader(dracoLoader)
      return loader
        .loadAsync(v)
        .then((glbNew) => {
          glbNew.scene.traverse((it) => {
            if (it.geometry) {
              it.frustumCulled = false
            }
          })

          gl.compile(glbNew.scene, new Camera())
          return glbNew
        })
        .catch((e) => {
          console.log(e)

          return false
        })
    }

    Promise.all([
      get(avatarPartUpper),
      Promise.all([
        //

        ...Fashion[0].motions.map((mo) => {
          return fbxLoader.loadAsync(mo.url).then((fbx) => {
            mo.fbx = fbx
            return mo
          })
        }),
      ]),
    ]).then(([base, actions]) => {
      //
      actions.forEach((mo) => {
        mixer.clipAction(mo.fbx.animations[0], base.scene)?.play()
      })

      if (base) {
        setBase(base)

        base.scene.traverse((obj) => {
          if (obj.skeleton) {
            setSkeleton(obj.skeleton)
          }
        })

        base.scene.traverse((obj) => {
          if (obj.isBone && obj.name.includes('Hips')) {
            setHips(obj)
          }
        })
      }
    })
  }, [avatarPartUpper, gl, camera])

  return (
    <group position={[0, 0, 0]}>
      {/*  */} {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/* {base && <primitive object={base.scene}></primitive>} */}
      {/*  */}
      {skeleton && hips && base && (
        <group ref={avatarGroup}>
          <group>
            <group>
              <group name={'Armature'} rotation={[-Math.PI * 0.5, 0, 0]}>
                <primitive object={hips} />

                <Suspense fallback={null}>
                  <Generic skeleton={skeleton} url={avatarPartUpper}></Generic>
                </Suspense>
                <Suspense fallback={null}>
                  <Generic skeleton={skeleton} url={avatarPartLower}></Generic>
                </Suspense>
                <Suspense fallback={null}>
                  <Generic skeleton={skeleton} url={avatarPartShoes}></Generic>
                </Suspense>
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
