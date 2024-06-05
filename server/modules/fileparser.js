const formidable = require("formidable");
const { Transform } = require("stream");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const Bucket = process.env.S3_BUCKET;

const parsefile = async (req, userDirectoryUrl) => {
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
        reject(err.message);
      }
    });

    form.on("error", (error) => {
      reject(error.message);
    });

    form.on("data", (data) => {
      if (data.name === "complete") {
        resolve(data.value);
      }
    });

    form.on("fileBegin", (formName, file) => {
      file.open = async function () {
        this._writeStream = new Transform({
          transform(chunk, encoding, callback) {
            callback(null, chunk);
          },
        });

        this._writeStream.on("error", (e) => {
          form.emit("error", e);
        });

        const s3Key = `${userDirectoryUrl}${Date.now().toString()}-${
          this.originalFilename
        }`;

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
          tags: [], // optional tags
          queueSize: 4, // optional concurrency configuration
          partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
          leavePartsOnError: false, // optional manually handle dropped parts
        })
          .done()
          .then((data) => {
            form.emit("data", { name: "complete", value: data });
          })
          .catch((err) => {
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
  });
};

module.exports = parsefile;
