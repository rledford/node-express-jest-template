'use strict';

const supertest = require('supertest');
const mongoose = require('mongoose');
const logger = require('../../logger');
const app = require('../../app');
const db = require('../../db');
const { describe, expect, beforeAll, afterAll, it } = require('@jest/globals');
const request = supertest(app.instance);

const mongoUri = 'mongodb://127.0.0.1:27017/test-api-users';

beforeAll(async () => {
  await db.connect(mongoUri);
  await app.start();
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

let createdUserId = '';
describe('POST api/users', () => {
  it('Should create a user', async () => {
    const res = await request
      .post('/api/users')
      .send({ username: 'test', password: '@T3st1ng' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('username');
    expect(res.body).not.toHaveProperty('salt');
    expect(res.body).not.toHaveProperty('hash');
    createdUserId = res.body._id;
  });

  it('Should NOT create user with duplicate username', async () => {
    const res = await request
      .post('/api/users')
      .send({ username: 'test', password: '@T3st1ng' });
    expect(res.status).toBe(409);
  });
});

describe('GET api/users/:id', () => {
  it('Should get a single user by _id', async () => {
    const res = await request.get(`/api/users/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body).not.toHaveProperty('salt');
    expect(res.body).not.toHaveProperty('hash');
  });
});

describe('GET api/users', () => {
  it('Should get a list of users', async () => {
    const res = await request.get(`/api/users`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    for (const user of res.body) {
      expect(user).not.toHaveProperty('salt');
      expect(user).not.toHaveProperty('hash');
    }
  });
});

describe('DELETE api/users/:id', () => {
  it('Should delete a single user by _id', async () => {
    const res = await request.delete(`/api/users/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('username');
    expect(res.body).not.toHaveProperty('salt');
    expect(res.body).not.toHaveProperty('hash');
  });
});
