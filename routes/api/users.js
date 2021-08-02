'use strict';

const { userService } = require('../../services');
const router = require('express').Router();

router.get('/', (req, res, next) => {
  userService
    .findMany({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
});
router.get('/:id', (req, res, next) => {
  userService
    .findById(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
});
router.post('/', (req, res, next) => {
  userService
    .create(req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
});
router.put('/', (req, res, next) => {
  res.status(200).json({
    action: 'put'
  });
});
router.patch('/', (req, res, next) => {
  res.status(200).json({
    action: 'patch'
  });
});

/**
 * Delete a user by _id
 */
router.delete('/:id', (req, res, next) => {
  userService
    .deleteById(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
});

module.exports = router;
