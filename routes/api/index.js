'use strict';

const cors = require('cors');
const router = require('express').Router();

router.use(cors());
router.use('/users', require('./users'));
router.use('/auth', require('./auth'));

module.exports = router;
