'use strict';

const router = require('express').Router();
const { authService } = require('../../services');

/**
 * Authenticates a user using BASIC auth and responds with a JWT
 * TODO: Add rate limiter
 */
router.post('/login', (req, res, next) => {
  const b64 = (req.headers.authorization || '').split(' ')[1] || '';
  const [username, password] = Buffer.from(b64, 'base64').toString().split(':');
  authService
    .login(username, password)
    .then((token) => {
      res.status(200).json({
        token
      });
    })
    .catch(next);
});

/**
 * Get a refreshed token if the token in the request header is valid
 */
router.get('/refresh', (req, res, next) => {
  const token = (req.headers.authorization || '').split(' ')[1] || '';
  authService
    .refreshToken(token)
    .then((token) => {
      res.status(200).json({
        token
      });
    })
    .catch(next);
});

module.exports = router;
