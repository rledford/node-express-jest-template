'use strict';

const HASH_ALGO = 'sha512';
const HASH_ALGO_ITERATIONS = 10000;
const HASH_ALGO_KEY_LENGTH = 512;
const SALT_BYTE_SIZE = 16;
const JWT_DURATION = 24 * 60 * 60; // 1 day in seconds

module.exports = {
  HASH_ALGO,
  HASH_ALGO_ITERATIONS,
  HASH_ALGO_KEY_LENGTH,
  SALT_BYTE_SIZE,
  JWT_DURATION
};
