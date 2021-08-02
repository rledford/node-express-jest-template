'use strict';

const Joi = require('joi');
const usernameRegex = /[a-z0-9]/i;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
const usernameValidator = Joi.string().min(3).regex(usernameRegex);
const passwordValidator = Joi.string().regex(passwordRegex);
const nameValidator = Joi.string().allow(null, '');

const createUserDataSchema = Joi.object({
  username: usernameValidator.required(),
  password: passwordValidator.required(),
  email: Joi.string().email().allow(null, '').optional(),
  firstName: nameValidator.optional(),
  lastName: nameValidator.optional()
}).options({ stripUnknown: true });

const updateUserDataSchema = Joi.object({
  email: Joi.string().email().allow(null, '').optional(),
  firstName: nameValidator.optional(),
  lastName: nameValidator.optional()
}).options({ stripUnknown: true });

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
