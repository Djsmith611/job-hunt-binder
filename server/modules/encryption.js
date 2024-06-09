const bcrypt = require('bcryptjs'); // Import bcryptjs for hashing and comparing passwords

const SALT_WORK_FACTOR = 10; // Define the salt work factor, determining the complexity of the salt

/**
 * Encrypts a password using bcrypt.
 * @param {string} password - The password to be encrypted.
 * @returns {string} The hashed password.
 */
const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR); // Generate a random salt
  // Hash the user password along with the generated salt
  // Store the salt and hash in the database instead of the actual password
  return bcrypt.hashSync(password, salt);
};

/**
 * Compares a candidate password with a stored hashed password.
 * @param {string} candidatePassword - The password input by the user.
 * @param {string} storedPassword - The hashed password stored in the database.
 * @returns {boolean} True if the passwords match, false otherwise.
 */
const comparePassword = (candidatePassword, storedPassword) => {
  // Compare the candidate password with the stored hashed password
  return bcrypt.compareSync(candidatePassword, storedPassword);
};

module.exports = {
  encryptPassword,
  comparePassword,
};
