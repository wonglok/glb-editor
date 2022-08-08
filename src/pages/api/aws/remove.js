// import { getSession } from "next-auth/react";
// import { User, isAdminEmail } from "../../../vfx-cloud/mongodb";
// import aws from "aws-sdk";
// import md5 from "md5";
import { removeFile } from '@/aws/aws.s3.api'

export default async function create(req, res) {
  let resRemove = await removeFile({ fileS3: req.body.fileS3 })

  res.status(200).json(resRemove)
}
