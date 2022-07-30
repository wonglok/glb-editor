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

let get = (v, gl, cam) => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/')

  let loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  return loader
    .loadAsync(v)
    .then((glbNew) => {
      // glbNew.scene.traverse((it) => {
      //   if (it.geometry) {
      //     it.frustumCulled = false
      //   }
      // })

      if (cam && gl) {
        gl.compile(glbNew.scene, cam)
      }
      return glbNew
    })
    .catch((e) => {
      console.log(e)

      return false
    })
}

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

  let [mixer] = useState(() => {
    return new AnimationMixer()
  })

  useFrame((st, dt) => {
    mixer.update(dt)
  })

  //
  useEffect(() => {
    let fbxLoader = new FBXLoader()

    Promise.all([
      get(avatarPartUpper, gl, camera),
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
  }, [avatarPartUpper, mixer, gl, camera])

  return (
    <group position={[0, 0, 0]}>
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
                  <Generic
                    skeleton={skeleton}
                    key={avatarPartUpper}
                    url={avatarPartUpper}
                  ></Generic>
                </Suspense>
                <Suspense fallback={null}>
                  <Generic
                    skeleton={skeleton}
                    key={avatarPartLower}
                    url={avatarPartLower}
                  ></Generic>
                </Suspense>
                <Suspense fallback={null}>
                  <Generic
                    skeleton={skeleton}
                    key={avatarPartShoes}
                    url={avatarPartShoes}
                  ></Generic>
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
  let [skinnedMeshes, setSkinMeshes] = useState([])
  let gl = useThree((s) => s.gl)
  let camera = useThree((s) => s.camera)
  useEffect(() => {
    get(url, gl, camera).then((glb) => {
      let arr = []
      glb.scene.traverse((it) => {
        if (it.isSkinnedMesh) {
          it.skeleton = skeleton
          arr.push(it)
        }
      })
      setSkinMeshes(<primitive object={glb.scene}></primitive>)
    })
  }, [url, gl, skeleton, camera])

  return <group>{skinnedMeshes}</group>
}
