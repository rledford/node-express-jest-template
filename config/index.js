'use strict';

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  logLevel: process.env.LOG_LEVEL || 'silly',
  port: parseInt(process.env.PORT) || 8080,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET
};
