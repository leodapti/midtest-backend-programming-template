const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check login credentials
    const loginResult = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginResult) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    // If loginResult contains an error message, return it
    if (loginResult.error) {
      throw errorResponder(errorTypes.FORBIDDEN, loginResult.error);
    }

    // If loginResult contains successful login data, return it
    return response.status(200).json(loginResult);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
