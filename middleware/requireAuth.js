'use strict';

const { authService, userService } = require('../services');

/**
 * Ensures the request header includes a valid JWT or responds with Unauthorized error. If the token is valid, the user record is attached to the request as 'currentUser'.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').split(' ')[1] || '';
  try {
    let decoded = await authService.readToken(token);
    let user = await userService.findById(decoded._id);
    req.currentUser = user;
  } catch (err) {
    return next(err);
  }
  next();
}

module.exports = requireAuth;
