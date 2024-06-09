const express = require("express");
const { rejectUnauthenticated } = require("../modules/authentication-middleware");
const pool = require("../modules/pool");
const parsefile = require("../modules/fileparser");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const router = express.Router();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.post("/", rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;
  console.log("User ID:", userId);

  try {
    // Query for user directory URL
    const result = await pool.query(
      `SELECT "s3_dir" FROM "user" WHERE id = $1`,
      [userId]
    );
    const directoryUrl = result.rows[0].s3_dir;

    if (!directoryUrl) {
      return res.status(400).send("User directory URL not found.");
    }

    console.log("User directory URL:", directoryUrl);

    // Parse the incoming form data
    const documentUrl = await parsefile(req, directoryUrl);
    console.log("Parsed file data:", { documentUrl });

    if (!documentUrl) {
      throw new Error("File upload failed");
    }

    res.status(200).send({ message: "File uploaded successfully.", documentUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file.");
  }
});

router.post("/documents", rejectUnauthenticated, async (req, res) => {
  const { leadId, documentUrl } = req.body;

  if (!leadId || !documentUrl) {
    return res.status(400).send("Missing leadId or documentUrl");
  }

  try {
    // Delete the previous document from S3 if it exists
    const previousDocumentResult = await pool.query(
      `SELECT "s3_url" FROM "documents" WHERE "lead_id" = $1`,
      [leadId]
    );

    if (previousDocumentResult.rows.length > 0) {
      const previousDocumentUrl = previousDocumentResult.rows[0].s3_url;
      console.log("Previous document URL:", previousDocumentUrl);

      // Ensure the key is correctly formatted and decoded
      const previousDocumentKey = decodeURIComponent(
        new URL(previousDocumentUrl).pathname.substring(1)
      ); // Remove leading slash and decode URI
      console.log("Previous document key:", previousDocumentKey);

      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: previousDocumentKey,
          })
        );
        console.log("Previous document deleted from S3");
      } catch (deleteError) {
        console.error("Error deleting previous document from S3:", deleteError);
      }

      // Delete the previous document entry from the database
      await pool.query(`DELETE FROM "documents" WHERE lead_id = $1`, [leadId]);
    }

    // Insert the new document record into the database
    await pool.query(
      `INSERT INTO "documents" (lead_id, s3_url) VALUES ($1, $2)`,
      [leadId, documentUrl]
    );

    res.status(200).send({ message: "Document URL updated successfully." });
  } catch (error) {
    console.error("Error updating document URL:", error);
    res.status(500).send("Error updating document URL.");
  }
});

module.exports = router;
