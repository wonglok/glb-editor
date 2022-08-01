import { Text } from '@react-three/drei'
import { useMetaStore } from '../store/use-meta-store'
import { Fashion } from './ClosetAvatar'
import { Sphere } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { ClosetAvatar } from './ClosetAvatar'
import { RPMAvatar } from './RPMAvatar'
import { CompanionWrap } from './CompanionWrap'
import { NPCAvatar } from './NPCAvatar'
import { UploadAvatar } from './UploadAvatar'

//
// import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'
// import { Object3D } from 'three140'
// import { fileSave } from 'browser-fs-access'

// let exportGLB = ({ object = new Object3D(), clips }) => {
//   const exporter = new GLTFExporter()
//   const options = {
//     binary: true,
//     trs: false,

//     onlyVisible: false,
//     truncateDrawRange: false,
//     binary: true,
//     maxTextureSize: Infinity,
//     animations: clips,
//     forceIndice: true,
//     includeCustomExtensions: true,
//   }

//   exporter.parseAsync(object, options).then(async (arrayBuffer) => {
//     //
//     let newFile = new Blob([arrayBuffer], {
//       type: 'application/octet-stream',
//     })

//     fileSave(newFile, {
//       fileName: 'combined-motion.glb',
//       extensions: ['.glb'],
//     })
//     //
//   })

//   //
// }
//
export function ClosetBtns() {
  let setAvatar = useMetaStore((s) => s.setAvatar)
  let exportAvatar = useMetaStore((s) => s.exportAvatar)
  let myCTX = useMetaStore((s) => s.myCTX)

  // UploadAvatar
  let [status, setStatus] = useState('stand')
  return (
    <group>
      <UploadAvatar></UploadAvatar>
      {/*  */}
      {myCTX?.player && (
        <CompanionWrap
          onChangeStatus={(v) => {
            //
            // onChangeStatus
            //
            if (status !== v) {
              setStatus(v)
            }
          }}
          speed={7.6}
          targetO3D={myCTX.player}
        >
          <NPCAvatar targetO3D={myCTX.player} status={status}></NPCAvatar>
        </CompanionWrap>
      )}

      <group position={[-10, 0, 0]}>
        <group position={[0, -0.55, -3]}>
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
          position={[0, 0, 1]}
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
          position={[0, 0, 2]}
        >
          Ready Player Me (VFX - 2)
        </Text>
      </group>
      <group position={[10, 0, 0]}>
        <Text
          rotation-x={Math.PI * -0.25}
          onClick={() => {
            //
            //
            setAvatar({
              vendor: 'closet',
            })
            setTimeout(() => {
              exportAvatar()
            }, 1)
            //
            //
          }}
          fontSize={1}
          position={[0, 2, -4]}
        >
          Download Avatar
        </Text>

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
              //

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
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
    </group>
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
    <Suspense
      fallback={
        <>
          <Sphere args={[3, 32, 32]}></Sphere>
        </>
      }
    >
      <RPMAvatar
        setAction={setAction}
        avatarActionName={avatarActionName}
        avatarActionIdleName={avatarActionIdleName}
        avatarActionRepeat={avatarActionRepeat}
        avatarURL={avatarURL}
      ></RPMAvatar>

      {/* {avatarVendor === 'rpm' && (
        <RPMAvatar
          setAction={setAction}
          avatarActionName={avatarActionName}
          avatarActionIdleName={avatarActionIdleName}
          avatarActionRepeat={avatarActionRepeat}
          avatarURL={avatarURL}
        ></RPMAvatar>
      )} */}

      {/* {avatarVendor === 'closet' && ( */}
      {/* <ClosetAvatar
        setAction={setAction}
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
      ></ClosetAvatar> */}
      {/* )} */}
    </Suspense>
  )
}

export function PreviewClosetAvaTester() {
  // let avatarVendor = useMetaStore((s) => s.myCTX.avatarVendor)

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
    <Suspense
      fallback={
        <>
          <Sphere args={[3, 32, 32]}></Sphere>
        </>
      }
    >
      {/* {avatarVendor === 'rpm' && (
        <RPMAvatar
          setAction={setAction}
          avatarActionName={avatarActionName}
          avatarActionIdleName={avatarActionIdleName}
          avatarActionRepeat={avatarActionRepeat}
          avatarURL={avatarURL}
        ></RPMAvatar>
      )} */}

      {/* {avatarVendor === 'closet' && ( */}
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
      {/* )} */}
    </Suspense>
  )
}
