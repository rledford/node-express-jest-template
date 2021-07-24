'use strict';

const Joi = require('joi');
const usernameRegex = /[a-z0-9]/i;
const usernameValidator = Joi.string().min(3).regex(usernameRegex);
const nameValidator = Joi.string().allow(null, '');

const createUserDataSchema = Joi.object({
  username: usernameValidator.required(),
  email: Joi.string().email().allow(null, '').optional(),
  firstName: nameValidator.optional(),
  lastName: nameValidator.optional()
}).options({ stripUnknown: true, abortEarly: true });

const updateUserDataSchema = Joi.object({
  email: Joi.string().email().allow(null, '').optional(),
  firstName: nameValidator.optional(),
  lastName: nameValidator.optional()
}).options({ stripUnknown: true, abortEarly: true });

function validateCreateUserData(data = {}) {
  return Joi.attempt(data, createUserDataSchema);
}

function validateUpdateUserData(data = {}) {
  return Joi.attempt(data, updateUserDataSchema);
}

module.exports = {
  validateCreateUserData,
  validateUpdateUserData
};
