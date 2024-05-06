const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

/**
 * Get total count of users
 * @param {Object} searchQuery - MongoDB search query
 * @returns {Promise<number>} Total count of users
 */
async function getTotalUserCount(searchQuery) {
  return User.countDocuments(searchQuery);
}


// pengambilan daftar pengguna dari database dengan dukungan 
//untuk pagination, pengurutan, dan penyaringan yang sesuai dengan kriteria yang diberikan
/**
 * Get a list of users with pagination support
 * @param {number} offset - Offset for pagination
 * @param {number} limit - Number of users to retrieve
 * @param {Object} sortOptions - Sorting options
 * @param {Object} searchQuery - MongoDB search query
 * @returns {Promise} Promise object represents the list of users
 */
async function getUsersPaginated(offset, limit, sortOptions, searchQuery) {
  return User.find(searchQuery).sort(sortOptions).skip(offset).limit(limit);
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  getTotalUserCount,
  getUsersPaginated,
};
