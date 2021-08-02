'use strict';

const supertest = require('supertest');
const mongoose = require('mongoose');
const logger = require('../../logger');
const app = require('../../app');
const db = require('../../db');
const { describe, expect, beforeAll, afterAll, it } = require('@jest/globals');
const { userService } = require('../../services');
const request = supertest(app.instance);

const mongoUri = 'mongodb://127.0.0.1:27017/test-api-auth';
const authLoginEndpoint = '/api/auth/login';
const authRefreshEndpoint = '/api/auth/refresh';
const testAuthUser = {
  username: 'test',
  password: '@T3st1ng'
};

let authToken = '';

beforeAll(async () => {
  await db.connect(mongoUri);
  await app.start();
  logger.info('Creating test user for auth with user service');
  await userService.create(testAuthUser);
});

afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
  } catch (err) {
    logger.error(`Error dropping test database: ${err}`);
  }
  await app.stop();
  db.close();
});

describe('POST api/auth/login', () => {
  it('Should authenticate and receive token', async () => {
    const res = await request
      .post(authLoginEndpoint)
      .auth(testAuthUser.username, testAuthUser.password);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    authToken = res.body.token;
  });

  it('Should NOT authenticate with incorrect username or password', async () => {
    const res = await request
      .post(authLoginEndpoint)
      .auth(testAuthUser.username, 'incorrectpassword');
    expect(res.status).toBe(401);
  });
});

describe('GET api/auth/refresh', () => {
  it('Should receive new token by providing a valid token obtained from login endpoint', async () => {
    const res = await request
      .get(authRefreshEndpoint)
      .auth(authToken, { type: 'bearer' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    authToken = res.body.token;
  });

  it('Should NOT refresh by providing an invalid token', async () => {
    const invalidToken = authToken + 'fff';
    const res = await request
      .get(authRefreshEndpoint)
      .auth(invalidToken, { type: 'bearer' });
    expect(res.status).toBe(401);
  });
});
