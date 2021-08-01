'use strict';

const logger = require('../logger');
const { userValidator } = require('../validators');
const User = require('../models/user');
const {
  ErrorNotFound,
  ErrorInternal,
  ErrorConflict,
  ErrorBadRequest
} = require('../const/errors');

/**
 * Creates a new user and returns it
 * @param {Object} userData
 * @returns Object
 * @throws Error
 */
async function create(userData = {}) {
  // validate user data
  try {
    userData = userValidator.validateCreateUserData(userData);
  } catch (err) {
    throw new ErrorBadRequest(err);
  }
  // create user
  const user = new User(userData);
  // hash password
  // create record
  try {
    await user.save();
    const userObj = user.toObject();
    delete userObj.hash;
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      throw new ErrorConflict('User must be unique');
    } else {
      throw new ErrorInternal();
    }
  }
}

/**
 * Updates an existing user with the provided updates
 * @param {String} id _id of an existing User
 * @param {Object} updates
 * @throws Error
 */
async function update(id = '', updates = {}) {
  // validate updates
  // update record
}

/**
 * Change an existing user's password
 * @param {String} id _id of an existing user
 * @param {Object} updates
 * @throws Error
 */
async function updatePassword(
  id = '',
  updates = { oldPassword: '', newPassword: '' }
) {
  // validate password
  // hash password
  // update user record
}

/**
 * Get an existing user by _id - does not return sensitive properties
 * @param {String} id _id
 * @returns Object
 * @throws Error
 */
async function findById(id = '') {
  let user = null;
  try {
    user = await User.findById({ _id: id }, { hash: 0 }).lean().exec();
  } catch (err) {
    logger.error(err);
    throw new ErrorInternal();
  }
  if (user === null) {
    throw new ErrorNotFound();
  }
  return user;
}

/**
 * Get all user's that match the provided filter
 * @param {Object} filter query filter
 * @returns Object[]
 * @throws Error
 */
async function findMany(filter = {}) {
  let result = [];
  try {
    // use lean and don't return sensitive data
    result = await User.find(filter, { hash: 0 }).lean().exec();
  } catch (err) {
    logger.error(err);
    throw new ErrorInternal();
  }
  return result;
}

/**
 * Deletes an existing user and returns the deleted record
 * @param {String} id _id of an existing user
 * @returns Object
 * @throws Error
 */
async function deleteById(id = '') {
  let user = null;
  try {
    user = User.findByIdAndRemove(id, { projection: { hash: 0 } }).exec();
  } catch (err) {
    logger.error(err);
    throw new ErrorInternal();
  }
  if (user === null) {
    throw new ErrorNotFound();
  }
  return user;
}

module.exports = {
  create,
  update,
  updatePassword,
  findById,
  findMany,
  deleteById
};
