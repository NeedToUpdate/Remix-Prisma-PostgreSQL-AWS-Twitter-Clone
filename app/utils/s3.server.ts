import { unstable_parseMultipartFormData, UploadHandler } from "@remix-run/node";
import S3 from "aws-sdk/clients/s3";
import cuid from "cuid";

const s3 = new S3({
  region: process.env.S3_BUCKET_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET,
});

async function convertToBuffer(a: AsyncIterable<Uint8Array>) {
  const result = [];
  for await (const chunk of a) {
    result.push(chunk);
  }
  return Buffer.concat(result);
}
const uploadHandler: UploadHandler = async ({ name, filename, data }) => {
  if (!filename || name !== "profile-pic") {
    return;
  }

  const { Location } = await s3
    .upload({
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: `${cuid()}.${filename.split(".").slice(-1)}`,
      Body: await convertToBuffer(data),
    })
    .promise();

  return Location;
};

export async function uploadAvatar(request: Request) {
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);

  const file = formData.get("profile-pic")?.toString() || "";

  return file;
}
