const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");
const parsefile = require("../modules/fileparser");

const router = express.Router();

router.post("/", rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT directory_url FROM "user" WHERE id = $1`,
      [userId]
    );
    const directoryUrl = result.rows[0].directory_url;

    if (!directoryUrl) {
      return res.status(400).send("User directory URL not found.");
    }

    const uploadResult = await parsefile(req, directoryUrl);
    res.status(200).send("File uploaded successfully.");
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file.");
  }
});

module.exports = router;
