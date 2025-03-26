import config from "#config";

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
    this.name = this.constructor.name;

    if (config.nodeEnv !== "production") {
      this.details = details;
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.details = [];
    }
  }
}
