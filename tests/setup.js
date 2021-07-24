'use strict';

process.env.NODE_ENV = 'test';
const app = require('../app');

module.exports = async () => {
  await app.start();
  global.__APP__ = app;
};
