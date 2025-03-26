import { Conflict, NotFound, InternalServerError } from "./http-errors";

export class OverwriteModelError extends Conflict {
  constructor(collection: string, message: string = "Model already exists") {
    super([{ collection }], message);
    Object.setPrototypeOf(this, OverwriteModelError.prototype);
  }
}

export class MissingSchemaError extends NotFound {
  constructor(collection: string, message: string = "Schema not found") {
    super([{ collection }], message);
    Object.setPrototypeOf(this, MissingSchemaError.prototype);
  }
}

export class GenericMongooseError extends InternalServerError {
  constructor(collection: string, details: Array<object>, message: string) {
    super([{ collection, ...details }], message);
  }
}

export class InvalidHookEventError extends Conflict {
  constructor(details: Array<object>, message: string = "Invalid hook event") {
    super(details, message);
  }
}

export class ModelRegistrationError extends InternalServerError {
  constructor(
    collection: string,
    details: Array<object> = [],
    message: string = "Erro ao registrar o modelo",
  ) {
    super([{ collection, ...details }], message);
  }
}

export class UnknownMongooseError extends InternalServerError {
  constructor(
    collection: string,
    details: Array<object> = [],
    message: string = "Erro desconhecido no Mongoose",
  ) {
    super([{ collection, ...details }], message);
  }
}

export class InvalidMiddlewareError extends InternalServerError {
  constructor(details: Array<object>, message: string = "Middleware inválido") {
    super(details, message);
  }
}

export default {
  OverwriteModelError,
  MissingSchemaError,
  GenericMongooseError,
  InvalidHookEventError,
  ModelRegistrationError,
  UnknownMongooseError,
  InvalidMiddlewareError,
};
