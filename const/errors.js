'use strict';

class ExtendableError extends Error {
  constructor(message = 'Error', statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

class BadRequestError extends ExtendableError {
  /**
   * Create a bad request error with statusCode set to 400
   * @param {String} message custom bad request message
   */
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

class UnauthorizedError extends ExtendableError {
  /**
   * Create a unauthorized error with statusCode set to 401
   * @param {String} message custom unauthorized message
   */
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends ExtendableError {
  /**
   * Create a forbidden error with statusCode set to 403
   * @param {String} message custom forbidden message
   */
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class NotFoundError extends ExtendableError {
  /**
   * Create a not found error with statusCode set to 404
   * @param {String} message custom not found message
   */
  constructor(message = 'Not found') {
    super(message, 404);
  }
}

class ConflictError extends ExtendableError {
  /**
   * Create a conflict error with statusCode set to 409
   * @param {String} message custom conflict message
   */
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

class InternalError extends ExtendableError {
  /**
   * Create an internal error with statusCode set to 500
   * @param {String} message custom internal message
   */
  constructor(message = 'Internal error') {
    super(message, 500);
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalError
};
