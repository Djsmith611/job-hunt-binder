const express = require("express");
const { rejectUnauthenticated } = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

// Fetch general analytics data
router.get("/", rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch applications per day
    const applicationsPerDayQuery = `
      SELECT to_char("app_date", 'Day') AS "day", COUNT(*) AS "applications"
      FROM "leads"
      WHERE "user_id" = $1
      GROUP BY to_char("app_date", 'Day'), to_char("app_date", 'D')
      ORDER BY to_char("app_date", 'D');
    `;
    const applicationsPerDayResult = await pool.query(applicationsPerDayQuery, [userId]);
    const applicationsPerDay = applicationsPerDayResult.rows;

    // Fetch applications by status
    const applicationsByStatusQuery = `
      SELECT "status"."name", COUNT(*) AS "count"
      FROM "leads"
      JOIN "status" ON "leads"."status_id" = "status"."id"
      WHERE "leads"."user_id" = $1
      GROUP BY "status"."name";
    `;
    const applicationsByStatusResult = await pool.query(applicationsByStatusQuery, [userId]);
    const applicationsByStatus = {};
    applicationsByStatusResult.rows.forEach(row => {
      applicationsByStatus[row.name] = parseInt(row.count, 10);
    });

    // Fetch applications by type
    const applicationsByTypeQuery = `
      SELECT "type"."name", COUNT(*) AS "count"
      FROM "leads"
      JOIN "type" ON "leads"."type_id" = "type"."id"
      WHERE "leads"."user_id" = $1
      GROUP BY "type"."name";
    `;
    const applicationsByTypeResult = await pool.query(applicationsByTypeQuery, [userId]);
    const applicationsByType = {};
    applicationsByTypeResult.rows.forEach(row => {
      applicationsByType[row.name] = parseInt(row.count, 10);
    });

    res.json({
      applicationsPerDay,
      applicationsByStatus,
      applicationsByType,
    });
  } catch (err) {
    console.error("Error fetching analytics data:", err);
    res.status(500).send("Server error");
  }
});

// Fetch job search funnel data
router.get("/funnel", rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const jobsSavedQuery = `SELECT COUNT(*) FROM "leads" WHERE "user_id" = $1`;
    const applicationsQuery = `SELECT COUNT(*) FROM "leads" WHERE "user_id" = $1 AND "status_id" >= 2`;
    const interviewsQuery = `SELECT COUNT(*) FROM "leads" WHERE "user_id" = $1 AND "status_id" >= 3`;
    const offersQuery = `SELECT COUNT(*) FROM "leads" WHERE "user_id" = $1 AND "status_id" >= 4`;

    const [jobsSavedResult, applicationsResult, interviewsResult, offersResult] = await Promise.all([
      pool.query(jobsSavedQuery, [userId]),
      pool.query(applicationsQuery, [userId]),
      pool.query(interviewsQuery, [userId]),
      pool.query(offersQuery, [userId]),
    ]);

    const funnelData = {
      jobsSaved: parseInt(jobsSavedResult.rows[0].count),
      applications: parseInt(applicationsResult.rows[0].count),
      interviews: parseInt(interviewsResult.rows[0].count),
      offers: parseInt(offersResult.rows[0].count),
    };

    res.json(funnelData);
  } catch (err) {
    console.error("Error fetching funnel data:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
