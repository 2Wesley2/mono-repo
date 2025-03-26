import { Request, Response, NextFunction } from "express";
import config from "#config";
import { GenericError } from "../errors/generic-error";

export default (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode =
    err instanceof GenericError && err.statusCode ? err.statusCode : 500;
  const message =
    err instanceof GenericError && err.message
      ? err.message
      : "Internal Server Error";
  const details =
    err instanceof GenericError && err.details.length ? err.details : undefined;

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
