const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"); // Import necessary AWS S3 modules
require("dotenv").config(); // Load environment variables from .env file

// Initialize S3 client with credentials and region from environment variables
const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to create a user directory in S3
const createUserDirectory = async (userId) => {
  // Define the directory name based on user ID
  const directoryName = `users/${userId}/`;

  // Define the parameters for the S3 PutObjectCommand
  const params = {
    Bucket: process.env.S3_BUCKET, // S3 bucket name from environment variables
    Key: directoryName, // Directory name to be created in the bucket
  };

  try {
    // Create and send the S3 PutObjectCommand
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log(`Directory ${directoryName} created successfully.`);

    // Construct and return the URL of the created directory
    const directoryUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${directoryName}`;
    return directoryUrl;
  } catch (error) {
    console.error("Error creating directory:", error); // Log any errors
    throw error; // Rethrow the error to be handled by the caller
  }
};

module.exports = createUserDirectory; // Export the function for use in other parts of the application
