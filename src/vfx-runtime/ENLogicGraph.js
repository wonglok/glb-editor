// import { createPortal, useFrame, useThree } from '@react-three/fiber'
// import React, { Suspense, useEffect, useRef, useState } from 'react'
// import { ENRuntime, getCodes } from './ENRuntime'
// import useSWR from 'swr'
// import { getEffectNodeData, getID } from './ENUtils'
// // import { ENState } from '../vfx-cms/ENState'
// // import { onReady } from '../vfx-cms/firebase'

// export function ENLogicGraphAutoLoad({
//   graphID,
//   componentName,
//   progress = null,
// }) {
//   if (!graphID) {
//     console.error('need graphID')
//   }

//   return (
//     <Suspense fallback={progress}>
//       <ENGraphLoader
//         componentName={componentName}
//         graphID={graphID}
//       ></ENGraphLoader>
//     </Suspense>
//   )
// }

// export function ENLogicGraph({ json, componentName = 'Root' }) {
//   let [engine, setGraph] = useState(false)
//   let [myInst, setCompos] = useState(() => {
//     return null
//   })

//   let mounter = useRef()

//   useEffect(() => {
//     let runtime = new ENRuntime({ json, codes: getCodes() })
//     setGraph(runtime)

//     runtime.mini.now.setCompos = setCompos

//     return () => {
//       runtime.mini.clean()
//       runtime.clean()
//     }
//   }, [])
//   ///
//   useFrame((st) => {
//     if (engine) {
//       for (let kn in st) {
//         engine.mini.set(kn, st[kn])
//       }
//       if (mounter.current && !engine.mini.resource.has('mounter')) {
//         engine.mini.set('mounter', mounter.current)
//       }
//       engine.mini.work()
//     }
//   })

//   return (
//     <>
//       <group>{myInst}</group>
//       <group ref={mounter}></group>
//     </>
//   )
// }

// //

// function ENGraphLoader({ graphID, componentName = 'Root' }) {
//   let { data, error } = useSWR(`${graphID}`, async (id) => {
//     let data = await getEffectNodeData(id)
//     return data
//   })

//   if (!data) {
//     return <group></group>
//   }

//   if (error) {
//     console.log(error)
//     return <group></group>
//   }

//   data.graphID = graphID

//   return (
//     <>
//       {/* {graphID && <AutoSync graphID={graphID}></AutoSync>} */}
//       <ENLogicGraph json={data} componentName={componentName}></ENLogicGraph>
//     </>
//   )
// }

// export function ENGraphJsonRunner({ json, componentName = 'Root' }) {
//   return <ENLogicGraph json={json} componentName={componentName}></ENLogicGraph>
// }
