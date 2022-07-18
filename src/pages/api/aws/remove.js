// import { getSession } from "next-auth/react";
// import { User, isAdminEmail } from "../../../vfx-cloud/mongodb";
// import aws from "aws-sdk";
// import md5 from "md5";
import { removeFile, signCDNFile } from '@/aws/aws.s3.api'
import { AdminEmail, firebaseConfig } from 'firebase.config'

let admin = require('firebase-admin')
let serviceAccount = false
if (process.env.NODE_ENV === 'development') {
  serviceAccount = require('/Volumes/StableFiles/AutoBackup/EffectNode/CREDENTIALS/effectnode-firebase-adminsdk-2hnej-733cf11054.json')
} else {
  serviceAccount = JSON.parse(process.env.FIRE_ENV_JSON.trim())
}

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseConfig.databaseURL,
  })
}

export default async function create(req, res) {
  let idToken = req.body.idToken

  //
  if (idToken) {
    admin
      .auth(admin.app())
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        // console.log(decodedToken)

        if (
          decodedToken &&
          decodedToken.email &&
          decodedToken.email_verified &&
          AdminEmail.includes(decodedToken.email)
        ) {
          let resRemove = await removeFile({ fileS3: req.body.fileS3 })

          res.status(200).json(resRemove)

          // res.status(200).json({ signature })
        } else {
          res.status(500).json({ error: 'not admin' })
        }
        // const uid = decodedToken.uid
      })
      .catch((error) => {
        // Handle error
        res.status(500).json({ error: 'bad login' })
      })

    //
    //
  } else {
    res.status(500).json({ error: 'missing token' })
  }

  // console.log(signature)

  // if (req.method === "POST") {
  //   const session = await getSession({ req });

  //   //
  //   if (session && session.user) {
  //     let user = await User.model.findOne({ email: session.user.email });
  //     if (user && isAdminEmail(user.email)) {

  //     } else {
  //       res.status(403).json({ msg: "Permission level not met" });
  //     }
  //   } else {
  //     res.status(406).json({ msg: "Not logged in" });
  //   }
  // } else {
  //   res.status(503).json({ msg: "wrong method" });
  // }
}

//

// // import { getSession } from "next-auth/react";
// // import { User, isAdminEmail } from "../../../vfx-cloud/mongodb";
// // import aws from "aws-sdk";
// // import md5 from "md5";
// // import { removeFile, signCDNFile } from '../../../vfx-cloud/aws-backend'

// import { removeFile } from '@/aws/aws.s3.api'

// export default async function create(req, res) {
//   //
//   let resRemove = await removeFile({ fileS3: req.body.fileS3 })
//   //
//   res.status(200).json(resRemove)

//   // if (req.method === "POST") {
//   //   const session = await getSession({ req });

//   //   //
//   //   if (session && session.user) {
//   //     let user = await User.model.findOne({ email: session.user.email });
//   //     if (user && isAdminEmail(user.email)) {
//   //     } else {
//   //       res.status(403).json({ msg: "Permission level not met" });
//   //     }
//   //   } else {
//   //     res.status(406).json({ msg: "Not logged in" });
//   //   }
//   // } else {
//   //   res.status(503).json({ msg: "wrong method" });
//   // }
// }

// //
