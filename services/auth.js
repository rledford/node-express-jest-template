'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const logger = require('../logger');
const config = require('../config');
const User = require('../models/user');
const {
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorInternal,
  ErrorBadRequest
} = require('../const/errors');
const {
  HASH_ALGO,
  HASH_ALGO_ITERATIONS,
  HASH_ALGO_KEY_LENGTH,
  JWT_DURATION,
  SALT_BYTE_SIZE
} = require('../const/auth');
const { authValidator } = require('../validators');

/**
 * Hashes the provided value using the provided salt. If a salt is not provided one will be generated.
 * Do not provide a salt when generating hashes. Do provide a salt when wanting to compare the result with another hash.
 * @param {String} value a string to hash
 * @param {String} salt a string to use as salt for hashing
 * @returns Object {hash: "", salt: ""}
 */
function hash(value = '', salt = '') {
  if (!salt) {
    salt = crypto.randomBytes(SALT_BYTE_SIZE).toString('hex');
  }
  const hash = crypto
    .pbkdf2Sync(
      value,
      salt,
      HASH_ALGO_ITERATIONS,
      HASH_ALGO_KEY_LENGTH,
      HASH_ALGO
    )
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

/**
 * Authenticates a user and returns a jwt
 * @param {String} username
 * @param {String} password
 * @returns String
 * @throws Error
 */
async function login(username = '', password = '') {
  if (!username || !password) {
    throw new ErrorUnauthorized('Missing credentials');
  }
  let user = null;
  try {
    user = await User.findOne({ username }).lean().exec();
  } catch (err) {
    logger.error(err);
    throw new ErrorInternal();
  }
  if (!user) {
    throw new ErrorNotFound('Unknown user');
  }
  if (!isHashMatch(password, user.salt, user.hash)) {
    throw new ErrorUnauthorized('Invalid username and password combination');
  }
  const token = createToken({
    _id: user._id.toString(),
    username: user.username
  });
  return token;
}

/**
 * Creates a JWT signed with the provided user data
 * @param {Object} authData Authentication data
 * @returns String
 * @throws Error if provided auth data is invalid
 */
async function createToken(authData = {}) {
  try {
    authData = authValidator.validateCreateTokenData(authData);
  } catch (err) {
    logger.error(err);
    throw new ErrorBadRequest('Invalid user data');
  }
  const { _id, username } = authData;
  const nowInSeconds = Date.now() / 1000;
  const token = jwt.sign(
    {
      _id,
      username,
      exp: parseInt(nowInSeconds + JWT_DURATION)
    },
    config.jwtSecret
  );
  return token;
}

/**
 * Decodes and verifies the provided token
 * @param {String} token JWT
 * @returns String
 * @throws Error if invalid or expired
 */
async function readToken(token = '') {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return reject(new ErrorUnauthorized('Token expired'));
        }
        return reject(new ErrorUnauthorized('Invalid token'));
      }
      try {
        decoded = authValidator.validateDecodedTokenData(decoded);
      } catch (err) {
        logger.error(err);
        return reject(new ErrorUnauthorized('Invalid token'));
      }
      resolve(decoded);
    });
  });
}

module.exports = {
  hash,
  login,
  createToken,
  readToken
};
