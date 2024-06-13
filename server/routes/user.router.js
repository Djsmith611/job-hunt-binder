const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const axios = require('axios');
const { encryptPassword } = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const createUserDirectory = require('../modules/userDirectory');

const router = express.Router();

router.get('/', rejectUnauthenticated, (req, res) => {
  res.send(req.user);
});

router.post('/register', async (req, res) => {
  const { email, password, f_name, l_name, recaptchaToken } = req.body;

  // Verify reCAPTCHA token
  const verifyRecaptcha = async (token) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    try {
      const response = await axios.post(url);
      return response.data.success;
    } catch (error) {
      console.error('Error verifying reCAPTCHA:', error);
      return false;
    }
  };

  const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
  if (!isRecaptchaValid) {
    return res.status(400).json({ error: 'Invalid reCAPTCHA' });
  }

  const encryptedPassword = encryptPassword(password);

  const queryText = `
    INSERT INTO "user" ("email", "password", "f_name", "l_name")
    VALUES ($1, $2, $3, $4) RETURNING "id";
  `;

  try {
    const result = await pool.query(queryText, [email, encryptedPassword, f_name, l_name]);
    const userId = result.rows[0].id;
    const directoryUrl = await createUserDirectory(userId);

    const updateQueryText = `
      UPDATE "user" 
      SET "s3_dir" = $1
      WHERE "id" = $2;
    `;

    await pool.query(updateQueryText, [directoryUrl, userId]);
    res.sendStatus(201);
  } catch (err) {
    console.error('User registration failed: ', err);
    res.sendStatus(500);
  }
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
