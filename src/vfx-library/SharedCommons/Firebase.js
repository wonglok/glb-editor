import { initializeApp } from 'firebase-v9/app'
import { getAnalytics } from 'firebase-v9/analytics'
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase-v9/auth'
import * as FDB from 'firebase-v9/database'

let map = new Map()

/** @returns { analytics: {}, auth: {}, app: {}, db: {}, FDB: FDB, getUser:{}, loginGuest: {} } */
export function getFirebaseAPI({ config }) {
  let firebaseConfig = config

  if (map.has(firebaseConfig.apiKey)) {
    return map.get(firebaseConfig.apiKey)
  }

  let app = initializeApp(firebaseConfig)

  let db = FDB.getDatabase(app)
  //
  let auth = getAuth(app)
  let fireUser = false
  auth.onAuthStateChanged((user) => {
    if (user) {
      fireUser = user
    } else {
      fireUser = false
    }
  })

  let getUser = () => {
    return new Promise((resolve) => {
      let tt = setInterval(() => {
        if (fireUser) {
          clearInterval(tt)
          resolve(fireUser)
        }
      })
    })
  }

  const analytics = getAnalytics(app)

  const loginGuest = async () => {
    let user = await signInAnonymously(auth)
    return user
  }

  let api = {
    analytics,
    auth,
    app,
    db,
    FDB,
    getUser,
    loginGuest,
    onAuthStateChanged,
  }

  map.set(firebaseConfig.apiKey, api)

  return api
}
