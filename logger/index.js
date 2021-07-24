'use strict';

const config = require('../config');
const winston = require('winston');

const formatter = winston.format.printf(
  (info) => `${info.timestamp} ${info.level} - ${info.message}`
);
const transports = [];
transports.push(new winston.transports.Console());

module.exports = winston.createLogger({
  level: config.logLevel,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    formatter
  ),
  transports
});
