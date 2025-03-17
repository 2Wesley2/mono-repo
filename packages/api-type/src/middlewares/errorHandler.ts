import { Request, Response, NextFunction } from "express";
import config from "../config/index";
import { BaseError } from "../errors/Exceptions";

export default (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode =
    err instanceof BaseError && err.statusCode ? err.statusCode : 500;
  const message =
    err instanceof BaseError && err.message
      ? err.message
      : "Internal Server Error";
  const details =
    err instanceof BaseError && err.details.length ? err.details : undefined;

  if (config.nodeEnv !== "production") {
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
      ...(details && { details }),
      stack: err.stack,
    });
  } else {
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
      ...(details && { details }),
    });
  }
};
