const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware"); // Middleware for authentication
const pool = require("../modules/pool"); // Database connection pool

const router = express.Router();

/****************** GET APPLICATIONS PER DAY FOR TRACKER ***************************/
/**
 * Route to get the number of applications per day within a specified date range for the authenticated user.
 */
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

  const queryValues = [userId, startDay, endDay]; // Values to be used in the SQL query

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
        const dayData = result.rows.find((row) => row.day.trim() === day);
        return {
          day,
          applications: dayData ? parseInt(dayData.applications) : 0, // Set applications count to 0 if no data for the day
        };
      });

      res.json(applicationsPerDay); // Send the resulting array as JSON response
    })
    .catch((err) => {
      console.error("Error retrieving tracker data:", err); // Handle any errors that occur during the query execution
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
});

/********************** GET ALL TYPES *********************/
/**
 * Route to get all types of leads.
 */
router.get("/types", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT *
    FROM "type"
    ORDER BY "id"; -- Ordered by id for organization
  `;

  pool
    .query(queryText)
    .then((result) => res.status(200).json(result.rows)) // 200(OK) // Sending results
    .catch((err) => {
      console.error("Error fetching types:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
});

/********************** GET ALL COMPANIES *********************/
/**
 * Route to get all companies.
 */
router.get("/companies", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT *
    FROM "company"
    ORDER BY "name"; -- Ordered by name for organization
  `;

  pool
    .query(queryText)
    .then((result) => res.status(200).json(result.rows)) // 200(OK) // Sending results
    .catch((err) => {
      console.error("Error fetching companies:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
});

/********************** ADD NEW COMPANY ***********************/
/**
 * Route to add a new company.
 */
router.post("/company", rejectUnauthenticated, (req, res) => {
  const company = req.body.company; // Pulling company from req.body
  const queryText = `
    INSERT INTO "company"("name")
    VALUES($1)
    RETURNING "id"; -- Returning id to be sent to client and sent with upcoming request
  `;

  pool
    .query(queryText, [company])
    .then((result) => res.status(201).json(result.rows[0].id)) // 201(CREATED) // Sending created id of company
    .catch((err) => {
      console.error("Error posting company:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
});

/********************** GET ALL LOCATIONS *********************/
/**
 * Route to get all locations.
 */
router.get("/locations", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT *
    FROM "location"
    ORDER BY "name"; -- Ordered by name for organization
  `;

  pool
    .query(queryText)
    .then((result) => res.status(200).json(result.rows)) // 200(OK) // Sending results
    .catch((err) => {
      console.error("Error fetching locations:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
});

/********************** ADD NEW LOCATION ***********************/
/**
 * Route to add a new location.
 */
router.post("/location", rejectUnauthenticated, (req, res) => {
  const location = req.body.location; // Pulling location from req.body
  const queryText = `
    INSERT INTO "location"("name")
    VALUES($1)
    RETURNING "id"; -- Returning id to be sent to client and sent with upcoming request
  `;

  pool
    .query(queryText, [location])
    .then((result) => res.status(201).json(result.rows[0].id)) // 201(CREATED) // Sending created location id
    .catch((err) => {
      console.error("Error posting location:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
});

/********************** GET ALL STATUSES *********************/
/**
 * Route to get all statuses.
 */
router.get("/statuses", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT *
    FROM "status"
    ORDER BY "id"; -- Ordered by id for organization
  `;

  pool
    .query(queryText)
    .then((result) => res.status(200).json(result.rows)) // 200(OK) // Sending results
    .catch((err) => {
      console.error("Error fetching statuses:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
});

/********************** GET ALL TITLES *********************/
/**
 * Route to get all titles.
 */
router.get("/titles", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT *
    FROM "title"
    ORDER BY "name"; -- Ordered by name for organization
  `;

  pool
    .query(queryText)
    .then((result) => res.status(200).json(result.rows)) // 200(OK) // Sending results
    .catch((err) => {
      console.error("Error fetching titles:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
});

/********************** ADD NEW TITLE ***********************/
/**
 * Route to add a new title.
 */
router.post("/title", rejectUnauthenticated, (req, res) => {
  const title = req.body.title; // Pulling title from req.body
  const queryText = `
    INSERT INTO "title"("name")
    VALUES($1)
    RETURNING "id"; -- Returning id to be sent to client and added into upcoming request
  `;

  pool
    .query(queryText, [title])
    .then((result) => res.status(201).json(result.rows[0].id)) // 201(CREATED) // Sending created title id
    .catch((err) => {
      console.error("Error posting title:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
});

/********************** GET ALL FIELDS *********************/
/**
 * Route to get all fields.
 */
router.get("/fields", rejectUnauthenticated, (req, res) => {
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
});

/********************** ADD NEW FIELD ***********************/
/**
 * Route to add a new field.
 */
router.post("/field", rejectUnauthenticated, (req, res) => {
  const field = req.body.field; // Pulling field from req.body
  const queryText = `
    INSERT INTO "field"("name")
    VALUES($1)
    RETURNING "id"; -- Returning id to be sent to client and sent with upcoming request
  `;

  pool
    .query(queryText, [field])
    .then((result) => res.status(201).json(result.rows[0].id)) // 201(CREATED) // Sending created field id
    .catch((err) => {
      console.error("Error posting field:", err);
      res.status(500).send("Server error"); // 500(INTERNAL SERVER ERROR)
    });
});

/********************** READY COUNT ***********************/
/**
 * Route to get the count of ready leads for the authenticated user.
 */
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
      res.status(200).send(result.rows[0].readycount); // Send the count of ready leads
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500); // 500(INTERNAL SERVER ERROR)
    });
});

module.exports = router; // Export the router for use in other parts of the application
