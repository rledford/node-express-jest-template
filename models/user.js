'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username required'],
    unique: true,
    uniqueCaseInsensitive: true
  },
  email: {
    type: String,
    default: null
  },
  firstName: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  hash: {
    type: String,
    default: ''
  },
  salt: {
    type: String,
    default: ''
  }
});

const User = mongoose.model('User', schema, 'users');

module.exports = User;
