const express = require("express");
const { rejectUnauthenticated } = require("../modules/authentication-middleware"); // Authenticator
const pool = require("../modules/pool"); // Database connection
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const router = express.Router();

/************** GET ALL USER LEADS *******************/
router.get("/", rejectUnauthenticated, (req, res) => {
  const userId = req.user.id; // Logged in user id

  // Query will select all leads and lead information related to the user
  const queryText = ` 
    SELECT 
      "l"."id",
      "s"."name" AS "status",
      "s"."color" AS "color",
      "ti"."name" AS "title",
      "f"."name" AS "field",
      "c"."name" AS "company",
      "lo"."name" AS "location",
      "t"."name" AS "type",
      "l"."notes",
      "l"."description" AS "description",
      "d"."s3_url" AS "document",
      "l"."is_favorite"
    FROM "leads" AS "l"
    LEFT JOIN "status" AS "s" ON "s"."id" = "l"."status_id"
    LEFT JOIN "title" AS "ti" ON "ti"."id" = "l"."title_id"
    LEFT JOIN "field" AS "f" ON "f"."id" = "l"."field_id"
    LEFT JOIN "company" AS "c" ON "c"."id" = "l"."company_id"
    LEFT JOIN "location" AS "lo" ON "lo"."id" = "l"."location_id"
    LEFT JOIN "type" AS "t" ON "t"."id" = "l"."type_id"
    LEFT JOIN "documents" AS "d" ON "d"."lead_id" = "l"."id"
    WHERE "l"."user_id" = $1
    ORDER BY "l"."id";
  `; // Ordered by id for sorting

  pool
    .query(queryText, [userId])
    .then((result) => res.status(200).json(result.rows)) // 200(OK) // Sending results
    .catch((err) => {
      console.error("Error fetching leads:", err);
      res.status(500).send("Server Error"); // 500(INTERNAL SERVER ERROR)
    });
}); /* END */

/***************** ADD USER LEAD *********************/
router.post("/", rejectUnauthenticated, (req, res) => {
  const userId = req.user.id; // Logged in user id

  const { status, title, field, company, location, type, notes, description } =
    req.body; // Destructured req.body for lead attributes

  console.log(req.body);

  // Query will post a new lead to database
  const queryText = `
    INSERT INTO "leads"
      ("user_id", "status_id", "title_id", "field_id", "company_id",
       "location_id", "type_id", "notes", "description")
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);
  `;

  const queryValues = [
    // Adding attributes and userId into an array
    userId,
    status,
    title,
    field,
    company,
    location,
    type,
    notes,
    description,
  ];

  pool
    .query(queryText, queryValues)
    .then((result) => res.sendStatus(201)) // 201(CREATED)
    .catch((err) => {
      console.error("Error posting lead:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
}); /* END */

/************** BATCH UPDATE USER LEAD STATUS *******/
router.put("/batch", rejectUnauthenticated, (req, res) => {
  console.log(req.body);
  const status = req.body.statusId; // Pulling status from req.body
  const leadIds = req.body.leadIds; // Pulling all ids from req.body
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0]; // Getting only the date
  let queryText = ``;
  let queryValues = []; // Setting query values in order

  if (status === 2) {
    queryText = `
      UPDATE "leads"
      SET "status_id" = $1, "app_date" = $2
      WHERE "id" = ANY($3::int[]);
    `;
    queryValues = [status, localDate, leadIds];
  } else if (status === 1) {
    queryText = `
      UPDATE "leads"
      SET "status_id" = $1, "app_date" = NULL
      WHERE "id" = ANY($2::int[]);
    `;
    queryValues = [status, leadIds];
  } else {
    queryText = `
      UPDATE "leads"
      SET "status_id" = $1
      WHERE "id" = ANY($2::int[]);
    `;
    queryValues = [status, leadIds];
  }

  pool
    .query(queryText, queryValues)
    .then((result) => {
      res.sendStatus(200); // 200(OK)
    })
    .catch((err) => {
      console.error("Error batch updating leads", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
}); /* END */

/****************** UPDATE USER LEAD *******************/
router.put("/:id", rejectUnauthenticated, (req, res) => {
  const leadId = req.params.id; // Logged in user id

  let { status, title, field, company, location, type, notes, description } =
    req.body; // Destructuring req.body for attributes
  status = parseInt(status); // ensuring status passed as integer
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0]; // Getting only the date
  let queryText = ``;
  let queryValues = [];

  // Query will update a single lead
  if (status === 1) {
    queryText = `
    UPDATE "leads"
    SET "status_id" = $1,
        "title_id" = $2,
        "field_id" = $3,
        "company_id" = $4,
        "location_id" = $5,
        "type_id" = $6,
        "notes" = $7,
        "description" = $8,
        "app_date" = NULL
    WHERE "id" = $9;
  `;

    queryValues = [
      // Adding leadId and attributes to array in order
      status,
      title,
      field,
      company,
      location,
      type,
      notes,
      description,
      leadId,
    ];
  } else if (status === 2) {
    queryText = `
    UPDATE "leads"
    SET "status_id" = $1,
        "title_id" = $2,
        "field_id" = $3,
        "company_id" = $4,
        "location_id" = $5,
        "type_id" = $6,
        "notes" = $7,
        "description" = $8,
        "app_date" = $9
    WHERE "id" = $10;
    `;

    queryValues = [
      // Adding leadId, date,  and attributes to array in order
      status,
      title,
      field,
      company,
      location,
      type,
      notes,
      description,
      localDate,
      leadId,
    ];
  } else {
    queryText = `
    UPDATE "leads"
    SET "status_id" = $1,
        "title_id" = $2,
        "field_id" = $3,
        "company_id" = $4,
        "location_id" = $5,
        "type_id" = $6,
        "notes" = $7,
        "description" = $8
    WHERE "id" = $9;
    `;

    queryValues = [
      // Adding leadId and attributes to array in order
      status,
      title,
      field,
      company,
      location,
      type,
      notes,
      description,
      leadId,
    ];
  }

  pool
    .query(queryText, queryValues)
    .then((result) => {
      res.sendStatus(200); // 200(OK)
    })
    .catch((err) => {
      console.error("Error updating lead:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
}); /* END */

/****************** UPDATE USER LEAD STATUS *******************/
router.put("/status/:id", rejectUnauthenticated, (req, res) => {
  console.log("changing status, req.body:", req.body);
  const leadId = parseInt(req.params.id);
  const status = req.body.statusId;
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0]; // Getting only the date
  let queryText = ``;
  let queryValues = []; // Setting query values in order

  if (status === 2) {
    queryText = `
        UPDATE "leads"
        SET "status_id" = $1, "app_date" = $2
        WHERE "id" = $3;
      `;
    queryValues = [status, localDate, leadId];
  } else if (status === 1) {
    queryText = `
        UPDATE "leads"
        SET "status_id" = $1, "app_date" = NULL
        WHERE "id" = $2;
      `;
    queryValues = [status, leadId];
  } else {
    queryText = `
        UPDATE "leads"
        SET "status_id" = $1
        WHERE "id" = $2;
      `;
    queryValues = [status, leadId];
  }

  console.log("queryText:", queryText);
  console.log("queryValues:", queryValues);

  pool
    .query(queryText, queryValues)
    .then((result) => {
      console.log("change successful");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

/****************** DELETE USER LEAD(S) *******************/
router.delete("/delete", rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;
  const leadIds = req.body.leadIds;
  console.log("req.body:", req.body);
  console.log("leadIds:", leadIds);

  const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    // Fetch document URLs associated with the leads to be deleted
    const fetchDocsQuery = `
          SELECT "s3_url" 
          FROM "documents" 
          WHERE "lead_id" = ANY($1::int[])
      `;
    const fetchDocsResult = await pool.query(fetchDocsQuery, [leadIds]);
    const documentUrls = fetchDocsResult.rows.map((row) => row.s3_url);

    // Delete documents from S3
    const deletePromises = documentUrls.map((url) => {
      const s3Key = decodeURIComponent(new URL(url).pathname.substring(1));
      console.log("Deleting S3 key:", s3Key);
      const deleteParams = {
        Bucket: process.env.S3_BUCKET,
        Key: s3Key,
      };
      return s3Client.send(new DeleteObjectCommand(deleteParams));
    });
    await Promise.all(deletePromises);
    console.log("Deleted documents from S3:", documentUrls);

    // Delete documents from the database
    const deleteDocsQuery = `
          DELETE FROM "documents"
          WHERE "lead_id" = ANY($1::int[])
      `;
    await pool.query(deleteDocsQuery, [leadIds]);

    // Delete leads from the database
    const deleteLeadsQuery = `
          DELETE FROM "leads"
          WHERE "id" = ANY($1::int[]) AND "user_id" = $2;
      `;
    await pool.query(deleteLeadsQuery, [leadIds, userId]);

    res.sendStatus(200);
  } catch (error) {
    console.log("Error deleting leads and documents:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
