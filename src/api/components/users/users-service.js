const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users with pagination, sorting, and filtering
 * @param {number} page_number - Page number
 * @param {number} page_size - Number of items per page
 * @param {string} sort - Sorting field and order (e.g., 'email:asc')
 * @param {string} search - Search query (e.g., 'name:John')
 * @returns {Object} Paginated list of users
 */

//mengambil daftar user dari database dengan mempertimbangkan pagination, sorting, dan filtering yang diminta, 
//kemudian mengembalikan respons dalam bentuk hasil yang berisi metadata pagination serta data pengguna yang sesuai dengan kriteria yang diberikan.
async function getUsers(
  page_number = 1,
  page_size = 10,
  sort = 'email:asc',
  search = ''
) {
  // Parsing sort parameter
  const [sortField, sortOrder] = sort.split(':');
  const sortOptions = {};
  if (sortField === 'name' || sortField === 'email') {
    sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;
  } else {
    // Default sort by email ascending if sort parameter is invalid
    sortOptions['email'] = 1;
  }

  // Parsing search parameter
  const [searchField, searchKey] = search.split(':');
  const searchQuery = {};
  if (searchField === 'name' || searchField === 'email') {
    searchQuery[searchField] = { $regex: new RegExp(searchKey, 'i') }; // Case-insensitive search
  }

  // Count total documents for pagination metadata
  const total_count = await usersRepository.getTotalUserCount(searchQuery);

  // Calculate pagination metadata
  const total_pages = Math.ceil(total_count / page_size);
  const has_previous_page = page_number > 1;
  const has_next_page = page_number < total_pages;

  // Perform database query with pagination, sorting, and filtering
  const offset = (page_number - 1) * page_size;
  const users = await usersRepository.getUsersPaginated(
    offset,
    page_size,
    sortOptions,
    searchQuery
  );

  // Prepare response object
  const response = {
    page_number,
    page_size,
    count: users.length,
    total_pages,
    has_previous_page,
    has_next_page,
    data: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })),
  };

  return response;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  checkPassword,
  emailIsRegistered,
};
