import AWS from "aws-sdk";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || "ap-south-1", // fallback to ap-south-1
  signatureVersion: "v4",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export function presignPut({ Key, ContentType }) {
  return s3.getSignedUrlPromise("putObject", {
    Bucket: process.env.S3_BUCKET,
    Key,
    ContentType,
    Expires: 300, // 5 min expiry
  });
}

export function getObject(Key) {
  return s3
    .getObject({
      Bucket: process.env.S3_BUCKET,
      Key,
    })
    .promise();
}

export function putObject({ Key, Body, ContentType }) {
  return s3
    .putObject({
      Bucket: process.env.S3_BUCKET,
      Key,
      Body,
      ContentType,
    })
    .promise();
}

