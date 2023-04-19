// import Box from "@mui/material/Box";
// import React, { PropsWithChildren } from "react";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import { SubTitle } from "components/Typography";
// import { SiMicrosoftexcel } from "react-icons/si";
// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// import fileDownload from "js-file-download";

// const REGION = process.env.NEXT_PUBLIC_REGION as string;
// const BUCKET = process.env.NEXT_PUBLIC_BUCKET_NAME as string;
// const CREDENTIALS = {
//   accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
//   secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY_ID as string,
// };

// const s3Client = new S3Client({ region: REGION, credentials: CREDENTIALS });

// type DownloadFileProps = {
//   fileName: string;
// };

// const DownloadFile = (props: DownloadFileProps) => {
//   const downloadFile = async () => {
//     const bucketParams = {
//       Bucket: BUCKET,
//       Key: props.fileName,
//     };

//     try {
//       // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
//       const data = await s3Client.send(new GetObjectCommand(bucketParams));
//       const dataString = (await data?.Body?.transformToString()) as string;
//       // Convert the ReadableStream to a string.
//       console.log("s3 data", data);
//       fileDownload(dataString, props.fileName);
//     } catch (err) {
//       console.log("Error downloading", err);
//     }
//   };

//   return <FileDownloadIcon onClick={downloadFile} sx={{ cursor: "pointer" }} />;
// };

// export default DownloadFile;
