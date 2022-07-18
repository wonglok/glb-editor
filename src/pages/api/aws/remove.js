// import { getSession } from "next-auth/react";
// import { User, isAdminEmail } from "../../../vfx-cloud/mongodb";
// import aws from "aws-sdk";
// import md5 from "md5";
// import { removeFile, signCDNFile } from '../../../vfx-cloud/aws-backend'

import { removeFile } from '@/aws/aws.s3.api'

export default async function create(req, res) {
  //
  let resRemove = await removeFile({ fileS3: req.body.fileS3 })
  //
  res.status(200).json(resRemove)

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
