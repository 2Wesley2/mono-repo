import mongoose, { Schema, model } from "mongoose";
import type { Model, SchemaTimestampsConfig } from "mongoose";
import type {
  RegisterConnectionEventsFunction,
  ConnectionEvents,
  MiddlewareConfig,
  RegisterDocumentParams,
  options,
} from "#mongoose-wrapper";

export const getMongooseReservedMethods = (): Set<string> => {
  const dummyModel = {} as Model<any>;
  return new Set(Object.getOwnPropertyNames(dummyModel));
};

export type ToObjectId = (id: string) => mongoose.Types.ObjectId;
export const toObjectId: ToObjectId = (id: string) =>
  new mongoose.Types.ObjectId(id);

export const registerConnectionEvents: RegisterConnectionEventsFunction = <
  ErrorType = Error,
>(
  events: ConnectionEvents<ErrorType>,
): void => {
  Object.entries(events).forEach(([event, callback]) => {
    mongoose.connection.on(
      event as keyof ConnectionEvents<ErrorType>,
      callback,
    );
  });
};

/** Classes abstratas */

/**
 * Define a interface para aplicação de middlewares em schemas.
 */
abstract class Middleware {
  abstract apply(
    schema: Schema,
    middleware: MiddlewareConfig & { hookEvent: any },
  ): void;
}

/**
 * Validações abstratas para middlewares.
 */
abstract class MiddlewareValidator {
  abstract validate(middleware: MiddlewareConfig): void;
}

/**
 * Estratégia abstrata para tratamento de erros.
 */
abstract class ErrorHandling {
  abstract handle(error: Error, collection: string): Model<any> | never;
}

/**
 * Estratégia abstrata para validação de parâmetros de registro de documentos.
 */
abstract class Validation {
  abstract validate(params: RegisterDocumentParams<any>): void;
}

/** Classes que estendem as abstratas */

/**
 * Implementação de middleware para eventos "pre".
 */
class PreMiddleware extends Middleware {
  apply(
    schema: Schema,
    middleware: MiddlewareConfig & { hookEvent: "createCollection" | RegExp },
  ): void {
    schema.pre(middleware.hookEvent, middleware.fn);
  }
}

/**
 * Implementação de middleware para eventos "post".
 */
class PostMiddleware extends Middleware {
  apply(
    schema: Schema,
    middleware: MiddlewareConfig & {
      hookEvent: "createCollection" | "insertMany" | "bulkWrite" | RegExp;
    },
  ): void {
    schema.post(middleware.hookEvent, middleware.fn);
  }
}

/**
 * Validação para eventos de hook do tipo string.
 */
export class StringHookEventValidator extends MiddlewareValidator {
  validate(middleware: MiddlewareConfig): void {
    if (typeof middleware.hookEvent !== "string") {
      throw new Error(`hookEvent inválido: esperado um valor do tipo string.`);
    }
  }
}

/**
 * Validação para eventos de hook do tipo RegExp.
 */
export class RegExpHookEventValidator extends MiddlewareValidator {
  validate(middleware: MiddlewareConfig): void {
    if (!(middleware.hookEvent instanceof RegExp)) {
      throw new Error(
        `Tipo de hookEvent inválido: ${typeof middleware.hookEvent}`,
      );
    }
    try {
      new RegExp(middleware.hookEvent.source);
    } catch {
      throw new Error(`hookEvent inválido: expressão regular inválida.`);
    }
  }
}

/**
 * Tratamento de erro para sobrescrever modelos existentes.
 */
export class OverwriteModelError extends ErrorHandling {
  handle(error: Error, collection: string): Model<any> {
    return mongoose.models[collection];
  }
}

/**
 * Tratamento de erro para esquemas ausentes.
 */
export class MissingSchemaError extends ErrorHandling {
  handle(error: Error, collection: string): never {
    throw new Error(
      `Erro: esquema não encontrado para o modelo "${collection}" (MissingSchemaError).`,
    );
  }
}

/**
 * Tratamento genérico de erros.
 */
export class GenericError extends ErrorHandling {
  handle(error: Error, collection: string): never {
    throw new Error(
      `Erro genérico ao registrar o modelo "${collection}": ${error.message}`,
    );
  }
}

/**
 * Validação da definição do schema.
 */
export class SchemaDefinitionValidation extends Validation {
  validate(params: RegisterDocumentParams<any>): void {
    if (
      !params.schemaDefinition ||
      typeof params.schemaDefinition !== "object" ||
      Object.keys(params.schemaDefinition).length === 0
    ) {
      throw new Error("Definição de schema inválida.");
    }
  }
}

/**
 * Validação do nome da coleção.
 */
export class CollectionNameValidation extends Validation {
  validate(params: RegisterDocumentParams<any>): void {
    if (!/^[a-zA-Z0-9-_]+$/.test(params.collection)) {
      throw new Error(
        `O nome da coleção "${params.collection}" contém caracteres inválidos.`,
      );
    }
  }
}

/**
 * Validação da contagem de campos no schema.
 */
export class FieldCountValidation extends Validation {
  validate(params: RegisterDocumentParams<any>): void {
    const fieldCount = Object.keys(params.schemaDefinition).length;
    if (fieldCount > 10000) {
      throw new Error(
        `O schema para a coleção "${params.collection}" excede o limite de 10.000 campos.`,
      );
    }
    if (fieldCount > 500) {
      console.warn(
        `Aviso: O schema para a coleção "${params.collection}" contém ${fieldCount} campos.`,
      );
    }
  }
}

/** Classes principais */

/**
 * Contexto para aplicação de middlewares.
 */
export class MiddlewareContext {
  private middlewares: Record<string, Middleware>;

  constructor() {
    this.middlewares = {
      pre: new PreMiddleware(),
      post: new PostMiddleware(),
    };
  }

  applyMiddleware(schema: Schema, middleware: MiddlewareConfig): void {
    const middlewareInstance = this.middlewares[middleware.method];
    if (!middlewareInstance) {
      throw new Error(`Método de middleware inválido: ${middleware.method}`);
    }
    middlewareInstance.apply(schema, middleware);
  }
}

/**
 * Contexto para validação de middlewares.
 */
export class MiddlewareValidationContext {
  private validators: Record<string, MiddlewareValidator>;

  constructor() {
    this.validators = {
      string: new StringHookEventValidator(),
      regexp: new RegExpHookEventValidator(),
    };
  }

  validate(middleware: MiddlewareConfig): void {
    const type = typeof middleware.hookEvent === "string" ? "string" : "regexp";
    const validator = this.validators[type];
    if (!validator) {
      throw new Error(`Tipo de hookEvent inválido: ${type}`);
    }
    validator.validate(middleware);
  }
}

/**
 * Contexto para tratamento de erros.
 */
export class ErrorHandlingContext {
  private handlers: Record<string, ErrorHandling>;

  constructor() {
    this.handlers = {
      OverwriteModelError: new OverwriteModelError(),
      MissingSchemaError: new MissingSchemaError(),
    };
  }

  static getInstance(): ErrorHandlingContext {
    return new ErrorHandlingContext();
  }

  handleError(error: Error, collection: string): Model<any> | never {
    const handler = this.handlers[error.name] || new GenericError();
    return handler.handle(error, collection);
  }
}

/**
 * Contexto para validação de parâmetros de registro de documentos.
 */
export class ValidationContext {
  private validations: Validation[] = [];

  addValidation(validation: Validation): void {
    this.validations.push(validation);
  }

  validate(params: RegisterDocumentParams<any>): void {
    this.validations.forEach((validation) => validation.validate(params));
  }
}

/**
 * Aplica validações padrão para os parâmetros de registro de documentos.
 * @param params - Parâmetros fornecidos para o registro do documento.
 * @throws Lança erros de validação, se aplicável.
 */
export const applyValidations = (params: RegisterDocumentParams<any>): void => {
  const validationContext = new ValidationContext();
  validationContext.addValidation(new SchemaDefinitionValidation());
  validationContext.addValidation(new CollectionNameValidation());
  validationContext.addValidation(new FieldCountValidation());
  validationContext.validate(params);
};

/**
 * Configura as opções padrão para um schema.
 * @param options - Opções fornecidas pelo usuário.
 * @returns Opções configuradas com valores padrão.
 * @throws Lança um erro se `timestamps` já estiver definido.
 */
export const configureOptions = (options: options = {}): options => {
  const defaultOptions: options = { timestamps: true };

  if (options.timestamps && typeof options.timestamps === "object") {
    defaultOptions.timestamps = {
      ...(defaultOptions.timestamps as SchemaTimestampsConfig),
      ...(options.timestamps as SchemaTimestampsConfig),
    };
  } else if (typeof options.timestamps === "boolean") {
    defaultOptions.timestamps = options.timestamps;
  }

  return { ...defaultOptions, ...options };
};

/**
 * Abstração para o Schema do Mongoose.
 */
export const MongooseSchema = Schema;
/**
 * Abstração para o Model do Mongoose.
 */
export const mongooseModel = model;
