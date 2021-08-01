'use strict';

const cors = require('cors');
const router = require('express').Router();

router.use(cors());
router.use('/users', require('./users'));

module.exports = router;
