const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const createUserDirectory = require('../modules/userDirectory');

const router = express.Router();

router.get('/', rejectUnauthenticated, (req, res) => {
  res.send(req.user);
});

router.post('/register', (req, res, next) => {
  const { email, password, f_name, l_name } = req.body;
  const encryptedPassword = encryptLib.encryptPassword(password);

  const queryText = `
    INSERT INTO "user" ("email", "password", "f_name", "l_name")
    VALUES ($1, $2, $3, $4) RETURNING "id";
  `;

  pool
    .query(queryText, [email, encryptedPassword, f_name, l_name])
    .then(async (result) => {
      const userId = result.rows[0].id;
      try{
        const directoryUrl = await createUserDirectory(userId);
        const updateQueryText = `
          UPDATE "user" 
          SET "s3_dir" = $1
          WHERE "id" = $2;
        `;
        await pool.query(updateQueryText, [directoryUrl, userId]);
        res.sendStatus(201);
      } catch (err){
        console.error('Error creating directory or updating user:', err);
        res.sendStatus(500);
      }
    })
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
});

module.exports = router;
