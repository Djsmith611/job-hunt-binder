const formidable = require("formidable"); // Library to handle file uploads
const Transform = require("stream").Transform; // Stream transform for handling file streams
const { S3Client } = require("@aws-sdk/client-s3"); // AWS SDK client for S3
const { Upload } = require("@aws-sdk/lib-storage"); // AWS SDK upload utility

// AWS credentials and configuration
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;

// Function to parse the file upload and upload it to S3
const parsefile = async (req, directoryUrl) => {
  return new Promise((resolve, reject) => {
    // Setting options for the formidable form
    let options = {
      maxFileSize: 100 * 1024 * 1024, // 100 MBs in bytes
      allowEmptyFiles: false, // Do not allow empty files
    };

    const form = new formidable.IncomingForm(); // Create a new instance of IncomingForm
    form.maxFileSize = options.maxFileSize; // Set maxFileSize option
    form.allowEmptyFiles = options.allowEmptyFiles; // Set allowEmptyFiles option

    // Parse the form data from the request
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err); // Log parsing errors
        reject(err.message); // Reject the promise with the error message
      }
      console.log("Parsed fields:", fields); // Log parsed fields
      console.log("Parsed files:", files); // Log parsed files
    });

    // Handle form errors
    form.on("error", (error) => {
      console.error("Formidable error:", error); // Log formidable errors
      reject(error.message); // Reject the promise with the error message
    });

    // Handle file upload start
    form.on("fileBegin", (formName, file) => {
      console.log("File upload started:", file.originalFilename); // Log the start of file upload

      // Construct the S3 key for the file
      const url = new URL(directoryUrl);
      let directoryPath = url.pathname.replace(/^\/+/, ''); // Remove leading slashes
      if (!directoryPath.endsWith('/')) {
        directoryPath += '/';
      }
      const s3Key = `${directoryPath}${Date.now().toString()}-${file.originalFilename}`;
      console.log("Constructed S3 Key:", s3Key);

      // Custom file open function to handle the stream
      file.open = async function () {
        this._writeStream = new Transform({
          transform(chunk, encoding, callback) {
            callback(null, chunk); // Pass the chunk to the next step in the stream
          },
        });

        // Handle stream errors
        this._writeStream.on("error", (e) => {
          form.emit("error", e); // Emit error event
        });

        // Upload the file to S3 using the AWS SDK
        new Upload({
          client: new S3Client({
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
            region,
          }),
          params: {
            ACL: "public-read", // Set the ACL to public-read
            Bucket, // S3 bucket name
            Key: s3Key, // S3 object key
            Body: this._writeStream, // Stream body
          },
        })
          .done()
          .then((data) => {
            console.log("File upload complete:", data.Location); // Log the completion of file upload
            form.emit("data", {
              name: "complete",
              value: { Location: data.Location },
            }); // Emit data event with the S3 location
          })
          .catch((err) => {
            console.error("Upload error:", err); // Log upload errors
            form.emit("error", err); // Emit error event
          });
      };

      // Custom file end function to handle the stream end
      file.end = function (cb) {
        this._writeStream.on("finish", () => {
          this.emit("end"); // Emit end event
          cb();
        });
        this._writeStream.end(); // End the write stream
      };
    });

    // Log when form parsing is complete
    form.on("end", () => {
      console.log("Form parsing complete");
    });

    // Handle data events and resolve the promise with the file URL
    form.on("data", (data) => {
      if (data.name === "complete") {
        resolve(data.value.Location); // Resolve with the file URL
      }
    });
  });
};

module.exports = parsefile; // Ex
