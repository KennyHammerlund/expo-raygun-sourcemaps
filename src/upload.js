const aws = require("aws-sdk");
const fs = require("fs").promises;

const upload = async (config, { path, name }) => {
  const { awsS3 } = config;
  if (!awsS3) throw new Error("AWS S3 Config object missing");
  if (!awsS3.accessKeyId) throw new Error("AWS S3 accessKeyId missing");
  if (!awsS3.secretAccessKey) throw new Error("AWS S3 secretAccessKey missing");
  if (!awsS3.bucketName) throw new Error("AWS S3 bucketName missing");
  if (!path) throw new Error("Sourcemap file Path not passed into upload");
  if (!name) throw new Error("Sourcemap file name not passed into upload");

  const awsClient = new aws.S3({
    accessKeyId: awsS3.accessKeyId,
    secretAccessKey: awsS3.secretAccessKey,
  });
  const fileContent = await fs.readFile(path);

  if (!fileContent) throw new Error("Source map not found");

  const putObject = await awsClient
    .upload({
      Key: name,
      // ContentType: mimetype,
      ACL: "public-read",
      Body: fileContent,
      Bucket: awsS3.bucketName,
    })
    .promise();
  console.log(putObject);
  if (!putObject.ETag)
    throw new Error("No Etag Returned from aws, file was not uploaded");

  console.log(
    `Uploaded ${putObject.key} to ${putObject.Bucket} (${putObject.Location})`
  );
};
module.exports.upload = upload;
