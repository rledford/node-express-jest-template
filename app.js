'use strict';

const config = require('./config');
const logger = require('./logger');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const helmet = require('helmet');
const { ErrorNotFound } = require('./const/errors');
const routes = require('./routes');

let db = null;
let server = null;

async function start() {
  logger.info('Starting application');
  // connect to database
  try {
    logger.info('Connecting to database');
    console.log(config.mongoUri);
    db = await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    logger.info('Connected to database');
    db.connection.on('error', (err) => {
      logger.error(`Database connection error occurred: ${err}`);
      process.exit(1);
    });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }

  // build express app
  // IMPORTANT: cors is only used in api routes to prevent Access-Control-Allow-Origin * when serving resources from /public
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
  // set server
  server = app.listen(config.port, () => {
    logger.info(`Application listening on port ${config.port}`);
  });
  app.on('error', (err) => {
    logger.error(`Error starting application: ${err}`);
    process.exit(1);
  });
}

function stop() {
  if (server !== null) {
    server.close();
  }
  if (db !== null) {
    db.connection.close();
  }
}

// exports start and stop to allow tests to start and stop the application
module.exports = {
  start,
  stop
};
