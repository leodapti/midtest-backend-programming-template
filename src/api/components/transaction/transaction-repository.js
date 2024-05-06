const { Transaction } = require('../../../models');

/**
 * Get a list of transactions
 * @returns {Promise}
 */
async function getTransactions() {
  return Transaction.find({});
}

/**
 * Get transaction detail
 * @param {string} id - Transaction ID
 * @returns {Promise}
 */
async function getTransaction(id) {
  return Transaction.findById(id);
}

/**
 * Create new transaction
 * @param {string} userId - User ID
 * @param {number} amount - Transaction amount
 * @returns {Promise}
 */
async function createTransaction(userId, amount) {
  return Transaction.create({
    userId,
    amount,
  });
}

/**
 * Update existing transaction
 * @param {string} id - Transaction ID
 * @param {number} amount - Transaction amount
 * @returns {Promise}
 */
async function updateTransaction(id, amount) {
  return Transaction.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        amount,
      },
    }
  );
}

/**
 * Delete a transaction
 * @param {string} id - Transaction ID
 * @returns {Promise}
 */
async function deleteTransaction(id) {
  return Transaction.deleteOne({ _id: id });
}

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
