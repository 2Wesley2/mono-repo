export class BaseError extends Error {
  statusCode: number;
  details: Array<object>;

  constructor(
    statusCode: number,
    details: Array<object> = [],
    message: string = "An unexpected error occurred",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class GenericError extends BaseError {
  constructor(
    details: Array<object>,
    message: string = "Internal Server Error",
  ) {
    super(500, details, message);
  }
}

export class InvalidRequestError extends BaseError {
  constructor(
    details: Array<object>,
    message: string = "Invalid request data",
  ) {
    super(400, details, message);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(
    details: Array<object> = [],
    message: string = "Unauthorized access",
  ) {
    super(401, details, message);
  }
}

export class ForbiddenError extends BaseError {
  constructor(details: Array<object>, message: string = "Forbidden access") {
    super(403, details, message);
  }
}

export class NotFoundError extends BaseError {
  constructor(details: Array<object>, message: string = "Resource not found") {
    super(404, details, message);
  }
}

export class PaymentDeniedError extends BaseError {
  constructor(details: Array<object>, message: string = "Payment required") {
    super(402, details, message);
  }
}

export class ConflictError extends BaseError {
  constructor(details: Array<object>, message: string = "Conflict detected") {
    super(409, details, message);
  }
}

export class TooManyRequestsError extends BaseError {
  constructor(
    details: Array<object>,
    message: string = "Too many requests, please try again later",
  ) {
    super(429, details, message);
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(
    details: Array<object>,
    message: string = "Unprocessable entity",
  ) {
    super(422, details, message);
  }
}

export class NoContentError extends BaseError {
  constructor(message: string = "No content available") {
    super(204, [], message);
  }
}

export const handleError = (error: any): BaseError => {
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
