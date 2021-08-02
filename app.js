'use strict';

const config = require('./config');
const logger = require('./logger');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const helmet = require('helmet');
const { ErrorNotFound } = require('./const/errors');
const routes = require('./routes');
const isTest = process.env.NODE_ENV === 'test';

let server = null;

// build express app
// NOTE: cors is only used in api routes to prevent Access-Control-Allow-Origin * when serving resources from /public
const app = express();
app.disable('x-powered-by');
app.enable('trust proxy');
app.use(
  helmet({
    contentSecurityPolicy: false,
    xssFilter: false
  })
);
app.use(compression());
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// load routes
app.use(routes);
// catch errors
app.use((req, res, next) => {
  next(new ErrorNotFound());
});
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.json({
    message: err.message
  });
});

app.on('error', (err) => {
  logger.error(`Application error occurred: ${err}`);
  process.exit(1);
});

async function start() {
  logger.info('Starting application server');
  const port = isTest ? 0 : config.port; // when testing, port 0 is used to allow os to choose an unused port for the server
  return new Promise((resolve) => {
    server = app.listen(port, () => {
      logger.info(`Application listening on port ${server.address().port}`);
      resolve();
    });
    server.on('error', () => {
      logger.error(`Application server error: ${err}`);
      process.exit(1);
    });
  });
}

function stop() {
  if (server !== null) {
    server.close();
  }
}

module.exports = {
  instance: app,
  start,
  stop
};
