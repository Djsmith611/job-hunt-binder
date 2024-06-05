const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to create user directory in S3
const createUserDirectory = async (userId) => {
  const directoryName = `users/${userId}/`;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: directoryName,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log(`Directory ${directoryName} created successfully.`);
    const directoryUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${directoryName}`;
    return directoryUrl;
  } catch (error) {
    console.error("Error creating directory:", error);
    throw error;
  }
};

module.exports = createUserDirectory;
