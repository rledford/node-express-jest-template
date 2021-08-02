'use strict';

const config = require('./config');
const logger = require('./logger');
const db = require('./db');
const app = require('./app');

async function main() {
  try {
    const database = await db.connect(config.mongoUri);
    database.connection.on('error', () => {
      logger.error(`Database connection error occurred: ${err}`);
      app.stop();
      process.exit(1);
    });
  } catch (err) {
    logger.error(`Error connecting to database: ${err}`);
    process.exit(1);
  }
  try {
    await app.start();
  } catch (err) {
    logger.error(`Error starting application: ${err}`);
    await db.close();
    process.exit(1);
  }
}

main();
