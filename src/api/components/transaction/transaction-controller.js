const transactionsService = require('./transaction-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of transactions request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getTransactions(request, response, next) {
  try {
    const transactions = await transactionsService.getTransactions();
    return response.status(200).json(transactions);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get transaction detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getTransaction(request, response, next) {
  try {
    const transaction = await transactionsService.getTransaction(
      request.params.id
    );

    if (!transaction) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Unknown transaction'
      );
    }

    return response.status(200).json(transaction);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create transaction request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createTransaction(request, response, next) {
  try {
    const userId = request.body.userId;
    const amount = request.body.amount;

    const success = await transactionsService.createTransaction(userId, amount);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create transaction'
      );
    }

    return response.status(200).json({ userId, amount });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update transaction request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateTransaction(request, response, next) {
  try {
    const id = request.params.id;
    const amount = request.body.amount;

    const success = await transactionsService.updateTransaction(id, amount);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update transaction'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete transaction request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteTransaction(request, response, next) {
  try {
    const id = request.params.id;

    const success = await transactionsService.deleteTransaction(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete transaction'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
