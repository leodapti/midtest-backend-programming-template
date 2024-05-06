const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

const loginAttempts = new Map(); // Storing login attempts in memory

const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  // Check if user's login attempt limit exceeded
  const attempt = loginAttempts.get(email) || 0;
  if (attempt >= LOGIN_LIMIT) {
    return {
      error: 'Too many failed login attempts. Please try again later.',
      status: 403, // Forbidden
    };
  }

  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    // Reset login attempt counter
    loginAttempts.delete(email);

    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else {
    // Increase login attempt counter
    loginAttempts.set(email, attempt + 1);

    // Clear login attempt counter after 30 minutes
    setTimeout(() => {
      loginAttempts.delete(email);
    }, LOGIN_WINDOW_TIME);

    return null;
  }
}

module.exports = {
  checkLoginCredentials,
};
