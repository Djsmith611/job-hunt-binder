const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

// Middleware Includes
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route Includes
const userRouter = require('./routes/user.router');
const uploadRouter = require('./routes/upload.router');
const leadsRouter = require('./routes/leads.router');
const dataRouter = require('./routes/data.router');

// Express Middleware
app.set('json spaces', 5); // to prettify json response
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build', { index: false }));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/data', dataRouter);

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
