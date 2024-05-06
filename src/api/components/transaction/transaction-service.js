const transactionsRepository = require('./transaction-repository');

/**
 * Get list of transactions
 * @returns {Array}
 */
async function getTransactions() {
  return transactionsRepository.getTransactions();
}

/**
 * Get transaction detail
 * @param {string} id - Transaction ID
 * @returns {Object}
 */
async function getTransaction(id) {
  return transactionsRepository.getTransaction(id);
}

/**
 * Create new transaction
 * @param {string} userId - User ID
 * @param {number} amount - Transaction amount
 * @returns {boolean}
 */
async function createTransaction(userId, amount) {
  const createdTransaction = await transactionsRepository.createTransaction(
    userId,
    amount
  );
  return !!createdTransaction;
}

/**
 * Update existing transaction
 * @param {string} id - Transaction ID
 * @param {number} amount - Transaction amount
 * @returns {boolean}
 */
async function updateTransaction(id, amount) {
  const updatedTransaction = await transactionsRepository.updateTransaction(
    id,
    amount
  );
  return !!updatedTransaction;
}

/**
 * Delete transaction
 * @param {string} id - Transaction ID
 * @returns {boolean}
 */
async function deleteTransaction(id) {
  const deletedTransaction = await transactionsRepository.deleteTransaction(id);
  return !!deletedTransaction;
}

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
