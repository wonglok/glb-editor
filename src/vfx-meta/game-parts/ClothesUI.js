import { Text } from '@react-three/drei'
import { useMetaStore } from '../store/use-meta-store'
import { Fashion } from './ClosetAvatar'
import { Sphere } from '@react-three/drei'
import { Suspense } from 'react'
import { ClosetAvatar } from './ClosetAvatar'
import { RPMAvatar } from './RPMAvatar'
import { UploadAvatar } from './UploadAvatar'
import { GLTFLoader } from 'three140/examples/jsm/loaders/GLTFLoader'
// import { CompanionWrap } from './CompanionWrap'
// import { NPCAvatar } from './NPCAvatar'
//useState

export function ClothesUI() {
  // UploadAvatar
  // let [status, setStatus] = useState('stand')
  return (
    <group>
      <UseAvatar></UseAvatar>
      <AvatarRPMARea></AvatarRPMARea>
      <AvatarMixMatch></AvatarMixMatch>

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
    </group>
  )
}

function UseAvatar() {
  let exportAvatar = useMetaStore((s) => s.exportAvatar)
  let myself = useMetaStore((s) => s.myself)
  let setAvatar = useMetaStore((s) => s.setAvatar)

  let avatars = useMetaStore((s) => s.avatars)
  let removeAvatar = useMetaStore((s) => s.removeAvatar)

  console.log(avatars)

  return (
    <>
      {myself && myself.uid && !myself.isAnonymous && (
        <>
          <group position={[12, 0, 0]}>
            <Text
              fontSize={1}
              rotation={[Math.PI * -0.25, 0, 0]}
              position={[0, 0.5, -2]}
            >
              Saved Avatars
            </Text>
            <UploadAvatar></UploadAvatar>

            <Text
              rotation-x={Math.PI * -0.25}
              onClick={() => {
                //
                exportAvatar()
                //
              }}
              fontSize={0.5}
              position={[0, 0.5, 1]}
            >
              Download Current Avatar
            </Text>

            <group position={[0, 0, 1.5]}>
              {avatars.map((a, idx) => {
                return (
                  <group key={a._id}>
                    <Text
                      rotation-x={Math.PI * -0.25}
                      onClick={() => {
                        //
                        let foundRPM = false
                        new GLTFLoader().loadAsync(a.url).then((glb) => {
                          glb.scene.traverse((it) => {
                            if (it.name.indexOf('Wolf3D_') !== -1) {
                              foundRPM = true
                            }
                          })
                        })

                        console.log(foundRPM)

                        setAvatar({
                          vendor: foundRPM ? 'rpm' : 'temp',
                          avatarURL: a.url,
                        })
                      }}
                      fontSize={0.5}
                      position={[-2.5, 0.5, 1 + idx]}
                    >
                      Use {idx} Avatar
                    </Text>

                    <Text
                      rotation-x={Math.PI * -0.25}
                      onClick={() => {
                        //
                        if (window.confirm('remove?')) {
                          setAvatar({
                            vendor: 'rpm',
                            avatarURL: `/scene/loklokdemo/lok-green-wear.glb`,
                          })
                          removeAvatar(a._id)
                        }
                      }}
                      fontSize={0.5}
                      position={[3, 0.5, 1 + idx]}
                      color={'red'}
                    >
                      Remove
                    </Text>
                  </group>
                )
              })}
            </group>
          </group>
        </>
      )}
    </>
  )
}

function AvatarMixMatch() {
  let setAvatar = useMetaStore((s) => s.setAvatar)
  return (
    <>
      <group position={[0, 0, 0]}>
        <group position={[0, -0.55, -2]}>
          <PreviewClosetAvaTester></PreviewClosetAvaTester>
        </group>

        <group position={[-2.5, 0, 0]}>
          <Text
            rotation-x={Math.PI * -0.25}
            position={[0, 0, 1]}
            onClick={() => {
              //

              let avatarPartUpper = Fashion[0].uppers[0].url

              setAvatar({
                vendor: 'closet',
                avatarPartUpper,
              })
            }}
            fontSize={1}
          >
            Upper A
          </Text>
          <Text
            rotation-x={Math.PI * -0.25}
            position={[0, 0, 2]}
            onClick={() => {
              //

              let avatarPartLower = Fashion[0].lowers[0].url

              setAvatar({
                vendor: 'closet',
                avatarPartLower,
              })
            }}
            fontSize={1}
          >
            Lower A
          </Text>
          <Text
            rotation-x={Math.PI * -0.25}
            position={[0, 0, 3]}
            onClick={() => {
              //

              let avatarPartShoes = Fashion[0].shoes[0].url

              setAvatar({
                vendor: 'closet',
                avatarPartShoes,
              })
            }}
            fontSize={1}
          >
            Shoes A
          </Text>
        </group>

        <group position={[2.5, 0, 0]}>
          <Text
            rotation-x={Math.PI * -0.25}
            position={[0, 0, 1]}
            onClick={() => {
              let avatarPartUpper = Fashion[0].uppers[1].url

              setAvatar({
                vendor: 'closet',
                avatarPartUpper,
              })
            }}
            fontSize={1}
          >
            Upper B
          </Text>
          <Text
            rotation-x={Math.PI * -0.25}
            position={[0, 0, 2]}
            onClick={() => {
              //

              let avatarPartLower = Fashion[0].lowers[1].url

              setAvatar({
                vendor: 'closet',
                avatarPartLower,
              })
            }}
            fontSize={1}
          >
            Lower B
          </Text>
          <Text
            rotation-x={Math.PI * -0.25}
            position={[0, 0, 3]}
            onClick={() => {
              //

              let avatarPartShoes = Fashion[0].shoes[1].url

              setAvatar({
                vendor: 'closet',
                avatarPartShoes,
              })
            }}
            fontSize={1}
          >
            Shoes B
          </Text>
        </group>
      </group>
    </>
  )
}
function AvatarRPMARea() {
  let setAvatar = useMetaStore((s) => s.setAvatar)
  return (
    <>
      <group position={[-12.5, 0, 0]}>
        <group position={[0, -0.55, -4]}>
          <PreviewRPMAvaTester></PreviewRPMAvaTester>
        </group>
        <Text
          rotation-x={Math.PI * -0.25}
          onClick={() => {
            //
            setAvatar({
              vendor: 'rpm',
              avatarURL: `/Metaverse/avatar/default-lok.glb`,
            })
          }}
          fontSize={0.5}
        >
          Ready Player Me (Lok)
        </Text>
        <Text
          rotation-x={Math.PI * -0.25}
          onClick={() => {
            //
            setAvatar({
              vendor: 'rpm',
              avatarURL: `/scene/loklokdemo/loklok-demo.glb`,
            })
          }}
          fontSize={0.5}
          position={[0, 0, 2]}
        >
          Ready Player Me (VFX - 1)
        </Text>
        <Text
          rotation-x={Math.PI * -0.25}
          onClick={() => {
            //
            setAvatar({
              vendor: 'rpm',
              avatarURL: `/scene/loklokdemo/shader-3.glb`,
            })
          }}
          fontSize={0.5}
          position={[0, 0, 3]}
        >
          Ready Player Me (VFX - 2)
        </Text>
        <Text
          rotation-x={Math.PI * -0.25}
          onClick={() => {
            //
            setAvatar({
              vendor: 'rpm',
              avatarURL: `/scene/loklokdemo/effect2.glb`,
            })
          }}
          fontSize={0.5}
          position={[0, 0, 4]}
        >
          Ready Player Me (VFX - 3)
        </Text>
        <Text
          rotation-x={Math.PI * -0.25}
          onClick={() => {
            //
            setAvatar({
              vendor: 'rpm',
              avatarURL: `/scene/loklokdemo/lok-green-wear.glb`,
            })
          }}
          fontSize={0.5}
          position={[0, 0, 1]}
        >
          Ready Player Me Green
        </Text>
      </group>
    </>
  )
}

export function PreviewRPMAvaTester() {
  // let avatarVendor = useMetaStore((s) => s.myCTX.avatarVendor)

  let avatarURL = useMetaStore((s) => s.myCTX.avatarURL)
  let avatarActionName = useMetaStore((s) => s.myCTX.avatarActionName)
  let avatarActionIdleName = useMetaStore((s) => s.myCTX.avatarActionIdleName)
  let avatarActionRepeat = useMetaStore((s) => s.myCTX.avatarActionRepeat)

  // let avatarPartUpper = useMetaStore((s) => s.myCTX.avatarPartUpper)
  // let avatarPartLower = useMetaStore((s) => s.myCTX.avatarPartLower)
  // let avatarPartShoes = useMetaStore((s) => s.myCTX.avatarPartShoes)
  // let setExporter = useMetaStore((s) => s.myCTX.setExporter)
  let setAction = useMetaStore((s) => s.setAction)

  return (
    <Suspense fallback={<></>}>
      <RPMAvatar
        setAction={setAction}
        avatarActionName={avatarActionName}
        avatarActionIdleName={avatarActionIdleName}
        avatarActionRepeat={avatarActionRepeat}
        avatarURL={avatarURL}
      ></RPMAvatar>
    </Suspense>
  )
}

export function PreviewClosetAvaTester() {
  let avatarVendor = useMetaStore((s) => s.myCTX.avatarVendor)

  // let avatarURL = useMetaStore((s) => s.myCTX.avatarURL)
  let avatarActionName = useMetaStore((s) => s.myCTX.avatarActionName)
  let avatarActionIdleName = useMetaStore((s) => s.myCTX.avatarActionIdleName)
  let avatarActionRepeat = useMetaStore((s) => s.myCTX.avatarActionRepeat)

  let avatarPartUpper = useMetaStore((s) => s.myCTX.avatarPartUpper)
  let avatarPartLower = useMetaStore((s) => s.myCTX.avatarPartLower)
  let avatarPartShoes = useMetaStore((s) => s.myCTX.avatarPartShoes)
  let avatarPartSkeleton = useMetaStore((s) => s.myCTX.avatarPartSkeleton)
  let setExporter = useMetaStore((s) => s.myCTX.setExporter)
  let setAction = useMetaStore((s) => s.setAction)

  return (
    <Suspense fallback={<></>}>
      {/* {avatarVendor === 'rpm' && (
        <RPMAvatar
          setAction={setAction}
          avatarActionName={avatarActionName}
          avatarActionIdleName={avatarActionIdleName}
          avatarActionRepeat={avatarActionRepeat}
          avatarURL={avatarURL}
        ></RPMAvatar>
      )} */}

      {
        <ClosetAvatar
          setAction={setAction}
          avatarPartSkeleton={avatarPartSkeleton}
          avatarPartUpper={avatarPartUpper}
          avatarPartLower={avatarPartLower}
          avatarPartShoes={avatarPartShoes}
          setExporter={setExporter}
          //
          avatarActionName={avatarActionName}
          avatarActionIdleName={avatarActionIdleName}
          avatarActionRepeat={avatarActionRepeat}
          //
          exportAvatar={false}
        ></ClosetAvatar>
      }
    </Suspense>
  )
}
