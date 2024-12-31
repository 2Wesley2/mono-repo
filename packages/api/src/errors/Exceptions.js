/**
 * Classe base para todos os erros da aplicação.
 * Estende a classe nativa Error para incluir detalhes e códigos de status.
 */
export class BaseError extends Error {
  /**
   * @param {number} statusCode - Código de status HTTP representando o erro.
   * @param {Array<Object>} details - Lista de detalhes relacionados ao erro.
   * @param {string} message - Mensagem padrão ou personalizada do erro.
   */
  constructor(statusCode, details = [], message = 'An unexpected error occurred') {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class GenericError extends BaseError {
  constructor(details, message = 'Internal Server Error') {
    super(500, details, message);
  }
}

export class InvalidRequestError extends BaseError {
  constructor(details, message = 'Invalid request data') {
    super(400, details, message);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(details = [], message = 'Unauthorized access') {
    super(401, details, message);
  }
}

export class ForbiddenError extends BaseError {
  constructor(details, message = 'Forbidden access') {
    super(403, details, message);
  }
}

export class NotFoundError extends BaseError {
  constructor(details, message = 'Resource not found') {
    super(404, details, message);
  }
}

export class PaymentDeniedError extends BaseError {
  constructor(details, message = 'Payment required') {
    super(402, details, message);
  }
}

export class ConflictError extends BaseError {
  constructor(details, message = 'Conflict detected') {
    super(409, details, message);
  }
}

export class TooManyRequestsError extends BaseError {
  constructor(details, message = 'Too many requests, please try again later') {
    super(429, details, message);
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(details, message = 'Unprocessable entity') {
    super(422, details, message);
  }
}

export class NoContentError extends BaseError {
  constructor(message = 'No content available') {
    super(204, [], message);
  }
}

export const handleError = (error) => {
  const { response } = error;

  if (response) {
    switch (response.status) {
      case 400:
        return new InvalidRequestError(response.data.details);
      case 401:
        return new UnauthorizedError(response.data.details);
      case 403:
        return new ForbiddenError(response.data.details);
      case 404:
        return new NotFoundError(response.data.details);
      case 402:
        return new PaymentDeniedError(response.data.details);
      case 409:
        return new ConflictError(response.data.details);
      case 422:
        return new UnprocessableEntityError(response.data.details);
      case 429:
        return new TooManyRequestsError(response.data.details);
      case 204:
        return new NoContentError();
      default:
        return new GenericError(response.data.details);
    }
  }

  return error;
};
