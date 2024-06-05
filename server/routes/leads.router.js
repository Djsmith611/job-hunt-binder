const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware"); // Authenticator
const pool = require("../modules/pool"); // Database connection

const router = express.Router();

/****************** GET APPLICATIONS PER DAY FOR TRACKER ***************************/
router.get("/tracker", rejectUnauthenticated, (req, res) => {
  const userId = req.user.id; // Get the user ID from the authenticated user
  const startDay = req.query.startDay; // Get the start day from query parameters
  const endDay = req.query.endDay; // Get the end day from query parameters

  // SQL query to count applications for each day within the date range
  const queryText = `
    SELECT
      to_char("app_date", 'Day') AS "day", -- Format the app_date to return the day of the week
      COUNT(*) AS "applications" -- Count the number of applications for each day
    FROM "leads"
    WHERE "user_id" = $1 AND "app_date" BETWEEN $2 AND $3 -- Filter by user_id and date range
    GROUP BY to_char("app_date", 'Day'), to_char("app_date", 'D') -- Group by day of the week and order by day of the week
    ORDER BY to_char("app_date", 'D'); -- Order by day of the week
  `;

  // Query values to be used in the SQL query
  const queryValues = [userId, startDay, endDay];

  // Execute the SQL query
  pool
    .query(queryText, queryValues)
    .then((result) => {
      // Array of all days in a week to ensure all days are covered
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      // Map the results to ensure each day of the week is included, even if there are no applications for that day
      const applicationsPerDay = days.map((day) => {
        // Find the data for the current day
        const dayData = result.rows.find((row) => row.day.trim() === day);
        return {
          day,
          applications: dayData ? parseInt(dayData.applications) : 0, // Set applications count to 0 if no data for the day
        };
      });

      // Send the resulting array as JSON response
      res.json(applicationsPerDay);
    })
    .catch((err) => {
      // Handle any errors that occur during the query execution
      console.error("Error retrieving tracker data:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
});

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
router.put("/", rejectUnauthenticated, (req, res) => {
  console.log(req.body);
  const status = req.body.statusToAdd; // Pulling status from req.body
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
  console.log(req.body);
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

/********************** GET ALL TYPES *********************/
router.get("/types", rejectUnauthenticated, (req, res) => {
  // Query will select all types
  const queryText = `
    SELECT *
    FROM "type"
    ORDER BY "id";
  `; // Ordered by id for organization

  pool
    .query(queryText)
    .then((result) => res.status(200).json(result.rows)) // 200(OK) // Sending results
    .catch((err) => {
      console.error("Error fetching types:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
}); /* END */

/********************** GET ALL COMPANIES *********************/
router.get("/companies", rejectUnauthenticated, (req, res) => {
  // Query will select all companies
  const queryText = `
    SELECT *
    FROM "company"
    ORDER BY "name";
  `; // Ordered by name for organization

  pool
    .query(queryText)
    .then((result) => res.status(200).json(result.rows)) // 200(OK) // Sending results
    .catch((err) => {
      console.error("Error fetching companies:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
}); //* END */

/********************** ADD NEW COMPANY ***********************/
router.post("/companies", rejectUnauthenticated, (req, res) => {
  const company = req.body.company; // Pulling company from req.body
  // Query will add a new company to the database
  const queryText = `
    INSERT INTO "company"("name")
    VALUES($1)
    RETURNING "id";
  `; // Returning id to be sent to client and sent with upcoming request
  pool
    .query(queryText, [company])
    .then((result) => res.status(201).json(result.rows[0].id)) // 201(CREATED) // Sending created id of company
    .catch((err) => {
      console.error("Error posting company:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
}); /* END */

/********************** GET ALL LOCATIONS *********************/
router.get("/locations", rejectUnauthenticated, (req, res) => {
  // Query will select all locations
  const queryText = `
    SELECT *
    FROM "location"
    ORDER BY "name";
  `; // Ordered by name for organization

  pool
    .query(queryText)
    .then((result) => res.status(200).json(result.rows)) // 200(OK) // Sending results
    .catch((err) => {
      console.error("Error fetching locations:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
}); /* END */

/********************** ADD NEW LOCATION ***********************/
router.post("/locations", rejectUnauthenticated, (req, res) => {
  const location = req.body.location; // Pulling location from req.body
  // Query will add a location to the database
  const queryText = `
    INSERT INTO "location"("name")
    VALUES($1)
    RETURNING "id";
  `; // Returning id to be sent to client and sent with upcoming request

  pool
    .query(queryText, [location])
    .then((result) => res.status(201).json(result.rows[0].id)) // 201(CREATED) // Sending created location id
    .catch((err) => {
      console.error("Error posting location:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
}); /* END */

/********************** GET ALL STATUSES *********************/
router.get("/statuses", rejectUnauthenticated, (req, res) => {
  // Query will select all statuses
  const queryText = `
    SELECT *
    FROM "status"
    ORDER BY "id";
  `; // Ordered by id for organization

  pool
    .query(queryText)
    .then((result) => res.status(200).json(result.rows)) // 200(OK) // Sending results
    .catch((err) => {
      console.error("Error fetching statuses:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
});

/********************** GET ALL TITLES *********************/
router.get("/titles", rejectUnauthenticated, (req, res) => {
  // Query will select all titles
  const queryText = `
    SELECT *
    FROM "title"
    ORDER BY "name";
  `; // Ordered by name for organization

  pool
    .query(queryText)
    .then((result) => res.status(200).json(result.rows)) // 200(OK) // Sending results
    .catch((err) => {
      console.error("Error fetching titles:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
}); /* END */

/********************** ADD NEW TITLE ***********************/
router.post("/titles", rejectUnauthenticated, (req, res) => {
  const title = req.body.title; // Pulling title from req.body
  // Query will add new title to database
  const queryText = `
    INSERT INTO "title"("name")
    VALUES($1)
    RETURNING "id";
  `; // Returning id to be sent to client and added into upcoming request
  pool
    .query(queryText, [title])
    .then((result) => res.status(201).json(result.rows[0].id)) // 201(CREATED) // Sending created title id
    .catch((err) => {
      console.error("Error posting title:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
}); /* END */

/********************** GET ALL FIELDS *********************/
router.get("/fields", rejectUnauthenticated, (req, res) => {
  // Query will select all fields
  const queryText = `
    SELECT *
    FROM "field";
  `;

  pool
    .query(queryText)
    .then((result) => res.status(200).json(result.rows)) // 200(OK) // Sending results
    .catch((err) => {
      console.error("Error fetching fields:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
}); /* END */

/********************** ADD NEW FIELD ***********************/
router.post("/fields", rejectUnauthenticated, (req, res) => {
  const field = req.body.field; // Pulling field from req.body
  // Query will add field to database
  const queryText = `
    INSERT INTO "field"("name")
    VALUES($1)
    RETURNING "id";
  `; // Returning id to be sent to client and sent with upcoming request
  pool
    .query(queryText, [field])
    .then((result) => res.status(201).json(result.rows[0].id)) // 201(CREATED) // Sending created field id
    .catch((err) => {
      console.error("Error posting field:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
}); /* END */

module.exports = router;
