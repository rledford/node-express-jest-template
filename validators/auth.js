'use strict';

const Joi = require('joi');

const createTokenSchema = Joi.object({
  _id: Joi.string().required(),
  username: Joi.string().required()
}).options({ stripUnknown: true, abortEarly: true });

const readTokenSchema = Joi.object({
  _id: Joi.string().required(),
  username: Joi.string().required(),
  exp: Joi.number().integer().required()
}).options({ stripUnknown: true, abortEarly: true });

function validateCreateTokenData(data = {}) {
  return Joi.attempt(data, createTokenSchema);
}

function validateDecodedTokenData(data = {}) {
  return Joi.attempt(data, readTokenSchema);
}

module.exports = {
  validateCreateTokenData,
  validateDecodedTokenData
};
