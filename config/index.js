'use strict';

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  logLevel: process.env.LOG_LEVEL || 'silly',
  port: parseInt(process.env.PORT) || 8080,
  mongoUri:
    process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI + '-test'
      : process.env.MONGO_URI
};
