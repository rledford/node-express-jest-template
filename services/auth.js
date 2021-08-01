'use strict';

const crypto = require('crypto');
const User = require('../models/user');
const logger = require('../logger');
const {
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorInternal
} = require('../const/errors');

/**
 * Hashes the provided value using the provided salt. If a salt is not provided one will be generated.
 * Do not provide a salt when generating hashes. Do provide a salt when wanting to compare the result with another hash.
 * @param {String} value a string to hash
 * @param {String} salt a string to use as salt for hashing
 * @returns Object {hash: "", salt: ""}
 */
function hash(value = '', salt = '') {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const hash = crypto
    .pbkdf2Sync(value, salt, 10000, 512, 'sha512')
    .toString('hex');

  return { hash, salt };
}

/**
 * Hashes the provided value using the provided salt and returns true if the result is equal to the 'expected' arg.
 * @param {String} value a string to hash
 * @param {String} salt a salt to use for hashing
 * @param {String} expected the expected has result
 */
function isHashMatch(value = '', salt = '', expected = '') {
  return hash(value, salt).hash === expected;
}

/** */

/**
 * Authenticates a user and returns a jwt
 * @param {String} username
 * @param {String} password
 * @returns String
 * @throws Error
 */
async function login(username = '', password = '') {
  let user = null;
  try {
    user = await User.findOne({ username }).lean().exec();
  } catch (err) {
    logger.error(err);
    throw new ErrorInternal('An unexpected error occurred');
  }
  if (!user) {
    throw new ErrorNotFound('Unknown user');
  }
  if (!isHashMatch(password, user.salt, user.hash)) {
    throw new ErrorUnauthorized('Invalid username and password combination');
  }
}

/**
 * Decodes and verifies the provided token
 * @param {String} token JWT
 * @returns String
 * @throws Error if invalid or expired
 */
async function verifyToken(token = '') {}

/**
 * Returns a new token if the provided token passes verification
 * @param {String} token JWT
 * @returns String
 * @throws Error if invalid or expired
 */
async function refreshToken(token = '') {}
