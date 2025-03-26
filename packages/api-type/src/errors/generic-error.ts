export class GenericError extends Error {
  statusCode: number;
  details: Array<object>;

  constructor(
    statusCode: number = 500,
    details: Array<object> = [],
    message: string = "Internal Server Error",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
