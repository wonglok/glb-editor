// import { getSession } from "next-auth/react";
// import { User, isAdminEmail } from "../../../vfx-cloud/mongodb";
// import aws from "aws-sdk";
// import md5 from "md5";
import { signCDNFile } from '@/aws/aws.s3.api'

export default async function create(req, res) {
  //
  let signature = await signCDNFile({
    fileName: req.body.fileName,
    folderPath: req.body.folderPath,
  })

  res.status(200).json({ signature })
}
