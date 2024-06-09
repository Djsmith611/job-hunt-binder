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
router.post("/company", rejectUnauthenticated, (req, res) => {
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
router.post("/location", rejectUnauthenticated, (req, res) => {
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
router.post("/title", rejectUnauthenticated, (req, res) => {
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
router.post("/field", rejectUnauthenticated, (req, res) => {
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

/********************** READY COUNT ***********************/
router.get("/ready", rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const queryText = `
    SELECT COUNT(*) AS readyCount
    FROM "leads"
    WHERE "user_id" = $1 AND "status_id" = 1;
  `;

  pool
    .query(queryText, [userId])
    .then((result) => {
      // console.log(result.rows[0].readycount);
      res.status(200).send(result.rows[0].readycount);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    })
});

module.exports = router;
