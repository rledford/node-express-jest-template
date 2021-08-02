'use strict';

const router = require('express').Router();

/**
 * Authenticates a user using BASIC auth and responds with a JWT
 * TODO: Add rate limiter
 */
router.post('/login', (req, res, next) => {});

/**
 * Get a refreshed token if the token in the request header is valid
 */
router.get('/refresh', (req, res, next) => {});

module.exports = router;
