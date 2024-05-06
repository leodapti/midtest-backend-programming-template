const joi = require('joi');

module.exports = {
  createTransaction: {
    body: {
      userId: joi.string().required().label('User ID'),
      amount: joi.number().positive().required().label('Transaction amount'),
    },
  },

  updateTransaction: {
    body: {
      amount: joi.number().positive().required().label('Transaction amount'),
    },
  },
};
