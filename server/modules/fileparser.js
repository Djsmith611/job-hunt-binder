const formidable = require("formidable");
const Transform = require("stream").Transform;
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;

const parsefile = async (req, directoryUrl) => {
  return new Promise((resolve, reject) => {
    let options = {
      maxFileSize: 100 * 1024 * 1024, // 100 MBs in bytes
      allowEmptyFiles: false,
    };

    const form = new formidable.IncomingForm();
    form.maxFileSize = options.maxFileSize;
    form.allowEmptyFiles = options.allowEmptyFiles;

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        reject(err.message);
      }
      console.log("Parsed fields:", fields);
      console.log("Parsed files:", files);
    });

    form.on("error", (error) => {
      console.error("Formidable error:", error);
      reject(error.message);
    });

    form.on("fileBegin", (formName, file) => {
      console.log("File upload started:", file.originalFilename);

      const url = new URL(directoryUrl);
      const directoryPath = url.pathname;
      const s3Key = `${directoryPath}${Date.now().toString()}-${file.originalFilename}`;
      file.open = async function () {
        this._writeStream = new Transform({
          transform(chunk, encoding, callback) {
            callback(null, chunk);
          },
        });

        this._writeStream.on("error", (e) => {
          form.emit("error", e);
        });

        new Upload({
          client: new S3Client({
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
            region,
          }),
          params: {
            ACL: "public-read",
            Bucket,
            Key: s3Key,
            Body: this._writeStream,
          },
        })
          .done()
          .then((data) => {
            console.log("File upload complete:", data.Location);
            form.emit("data", { name: "complete", value: { Location: data.Location } });
          })
          .catch((err) => {
            console.error("Upload error:", err);
            form.emit("error", err);
          });
      };

      file.end = function (cb) {
        this._writeStream.on("finish", () => {
          this.emit("end");
          cb();
        });
        this._writeStream.end();
      };
    });

    form.on("end", () => {
      console.log("Form parsing complete");
    });

    form.on("data", (data) => {
      if (data.name === "complete") {
        resolve(data.value.Location); // Resolve with the file URL
      }
    });
  });
};

module.exports = parsefile;
