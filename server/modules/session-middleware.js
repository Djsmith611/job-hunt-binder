const expressSession = require("express-session"); // Import the express-session module
const PgSession = require("connect-pg-simple")(expressSession); // Import the connect-pg-simple module and pass expressSession to it
const pool = require("./pool.js"); // Import the database connection pool
const warnings = require("../constants/warnings"); // Import warning messages

/*
  The session allows a user to log in with their username and password once,
  and remain logged in across multiple requests. This is achieved by giving them
  a long random string (session ID) stored in a cookie, which the browser sends
  back with every request. The server can validate this string to confirm the user's identity.

  The session ID can be seen in the browser's developer tools under
  `Application` -> `Storage` -> `Cookies`.
*/

// Function to retrieve and validate the server session secret
const serverSessionSecret = () => {
  // Check if the SERVER_SESSION_SECRET environment variable is set and valid
  if (
    !process.env.SERVER_SESSION_SECRET ||
    process.env.SERVER_SESSION_SECRET.length < 8 ||
    process.env.SERVER_SESSION_SECRET === warnings.exampleBadSecret
  ) {
    // Log a warning if the session secret is missing or not secure enough
    console.log(warnings.badSecret);
  }

  // Return the server session secret
  return process.env.SERVER_SESSION_SECRET;
};

// Set the session prune interval, disabling it during tests
let pruneSessionInterval = 60;
if (process.env.NODE_ENV === "test") {
  pruneSessionInterval = false;
}

// Configure and export the session middleware
module.exports = expressSession({
  store: new PgSession({
    pool, // Use the database connection pool
    pruneSessionInterval, // Set the prune session interval
    createTableIfMissing: true, // Create the session table if it doesn't exist
  }),
  secret: serverSessionSecret() || "secret", // Session secret from environment variable or default value
  name: "user", // Name of the session ID cookie
  saveUninitialized: false, // Do not save uninitialized sessions
  resave: false, // Do not resave sessions that have not been modified
  // Cookie settings for the session
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie expires after 7 days
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    secure: false, // Set to true only if the app is served over HTTPS
  },
});
