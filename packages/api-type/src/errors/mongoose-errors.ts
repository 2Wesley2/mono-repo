import { Conflict, NotFound, InternalServerError } from "./http-errors";

class OverwriteModelError extends Conflict {
  constructor(collection: string, message: string = "Model already exists") {
    super([{ collection }], message);
    Object.setPrototypeOf(this, OverwriteModelError.prototype);
  }
}

class MissingSchemaError extends NotFound {
  constructor(collection: string, message: string = "Schema not found") {
    super([{ collection }], message);
    Object.setPrototypeOf(this, MissingSchemaError.prototype);
  }
}

class GenericMongooseError extends InternalServerError {
  constructor(collection: string, details: Array<object>, message: string) {
    super([{ collection, ...details }], message);
  }
}

class InvalidHookEventError extends Conflict {
  constructor(details: Array<object>, message: string = "Invalid hook event") {
    super(details, message);
  }
}

class ModelRegistrationError extends InternalServerError {
  constructor(
    collection: string,
    details: Array<object> = [],
    message: string = "Erro ao registrar o modelo",
  ) {
    super([{ collection, ...details }], message);
  }
}

class UnknownMongooseError extends InternalServerError {
  constructor(
    collection: string,
    details: Array<object> = [],
    message: string = "Erro desconhecido no Mongoose",
  ) {
    super([{ collection, ...details }], message);
  }
}

const mongooseErrors = {
  OverwriteModelError: (
    ...args: ConstructorParameters<typeof OverwriteModelError>
  ) => new OverwriteModelError(...args),
  MissingSchemaError: (
    ...args: ConstructorParameters<typeof MissingSchemaError>
  ) => new MissingSchemaError(...args),
  GenericMongooseError: (
    ...args: ConstructorParameters<typeof GenericMongooseError>
  ) => new GenericMongooseError(...args),
  InvalidHookEventError: (
    ...args: ConstructorParameters<typeof InvalidHookEventError>
  ) => new InvalidHookEventError(...args),
  ModelRegistrationError: (
    ...args: ConstructorParameters<typeof ModelRegistrationError>
  ) => new ModelRegistrationError(...args),
  UnknownMongooseError: (
    ...args: ConstructorParameters<typeof UnknownMongooseError>
  ) => new UnknownMongooseError(...args),
};

export default mongooseErrors;
