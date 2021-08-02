'use strict';

const { userService } = require('../../services');
const { requireAuth } = require('../../middleware');
const router = require('express').Router();

/**
 * Get a list of user records
 */
router.get('/', requireAuth, (req, res, next) => {
  userService
    .findMany({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
});

/**
 * Get an existing user by _id
 */
router.get('/:id', requireAuth, (req, res, next) => {
  userService
    .findById(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
});

/**
 * Create a user
 */
router.post('/', requireAuth, (req, res, next) => {
  userService
    .create(req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
});

/**
 * Update a user by _id
 * TODO: implement patch route
 */
router.patch('/:id', requireAuth, (req, res, next) => {
  res.status(200).json({
    action: 'patch'
  });
});

/**
 * Delete a user by _id
 */
router.delete('/:id', requireAuth, (req, res, next) => {
  userService
    .deleteById(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
});

module.exports = router;
