'use strict';

const mongoose = require('mongoose');
const logger = require('../logger');

/**
 * Connects to MongoDB using the provided uri
 * @param {String} uri mongodb uri
 * @throws Error
 */
async function connect(uri = '') {
  logger.info('Connecting to database');
  const db = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
  logger.info('Connected to database');
}

/**
 * Closes the database connection
 */
async function close() {
  try {
    await mongoose.connection.close();
  } catch (err) {
    logger.error(err);
  }
}

module.exports = {
  connect,
  close
};
