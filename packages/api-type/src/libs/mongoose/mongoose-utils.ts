import mongoose, { Schema, model } from "mongoose";
import type { Model, SchemaTimestampsConfig } from "mongoose";
import type {
  RegisterConnectionEventsFunction,
  ConnectionEvents,
  MiddlewareConfig,
  RegisterDocumentParams,
  options,
} from "#mongoose-wrapper";
import mongooseErrors from "#errors-mongoose";
import { Conflict, NotFound } from "#http-errors";
import type { IMongooseErrorHandler } from "#contract-mongoose";

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
      throw new mongooseErrors.GenericMongooseError(
        "Middleware",
        [{ hookEvent: middleware.hookEvent }],
        `hookEvent inválido: esperado um valor do tipo string.`,
      );
    }
  }
}

/**
 * Validação para eventos de hook do tipo RegExp.
 */
export class RegExpHookEventValidator extends MiddlewareValidator {
  validate(middleware: MiddlewareConfig): void {
    if (!(middleware.hookEvent instanceof RegExp)) {
      throw new mongooseErrors.GenericMongooseError(
        "Middleware",
        [{ hookEvent: middleware.hookEvent }],
        `Tipo de hookEvent inválido: ${typeof middleware.hookEvent}`,
      );
    }
    try {
      new RegExp(middleware.hookEvent.source);
    } catch {
      throw new mongooseErrors.GenericMongooseError(
        "Middleware",
        [{ hookEvent: middleware.hookEvent }],
        `hookEvent inválido: expressão regular inválida.`,
      );
    }
  }
}

/**
 * Verifica se a definição do schema é válida.
 * @param schemaDefinition - A definição do schema a ser validada.
 * @returns Verdadeiro se a definição for válida, falso caso contrário.
 */
export const isValidSchemaDefinition = (
  schemaDefinition: RegisterDocumentParams<any>["schemaDefinition"],
): boolean => {
  return (
    schemaDefinition &&
    typeof schemaDefinition === "object" &&
    Object.keys(schemaDefinition).length > 0
  );
};

/**
 * Validação da definição do schema.
 */
export class SchemaDefinitionValidation extends Validation {
  validate(params: RegisterDocumentParams<any>): void {
    if (!isValidSchemaDefinition(params.schemaDefinition)) {
      throw new mongooseErrors.GenericMongooseError(
        params.collection,
        [{ schemaDefinition: params.schemaDefinition }],
        "Definição de schema inválida.",
      );
    }
  }
}

/**
 * Validação do nome da coleção.
 */
export class CollectionNameValidation extends Validation {
  validate(params: RegisterDocumentParams<any>): void {
    if (!/^[a-zA-Z0-9-_]+$/.test(params.collection)) {
      throw new mongooseErrors.GenericMongooseError(
        params.collection,
        [{ collection: params.collection }],
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
      throw new mongooseErrors.GenericMongooseError(
        params.collection,
        [{ fieldCount }],
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
  private validators: Map<string, MiddlewareValidator>;

  constructor() {
    this.validators = new Map<string, MiddlewareValidator>([
      ["string", new StringHookEventValidator()],
      ["regexp", new RegExpHookEventValidator()],
    ]);
  }

  /**
   * Registra dinamicamente um validador.
   * @param type - Tipo de hookEvent.
   * @param validator - Instância do validador.
   */
  registerValidator(type: string, validator: MiddlewareValidator): void {
    if (this.validators.has(type)) {
      throw new Error(`Validador para o tipo "${type}" já está registrado.`);
    }
    this.validators.set(type, validator);
  }

  /**
   * Valida o middleware com base no tipo de hookEvent.
   * @param middleware - Configuração do middleware.
   * @throws Lança erro se o tipo de hookEvent for inválido ou não suportado.
   */
  validate(middleware: MiddlewareConfig): void {
    const type = this.getHookEventType(middleware.hookEvent);
    const validator = this.validators.get(type);

    if (!validator) {
      throw new Error(
        `Tipo de hookEvent inválido ou não suportado: "${type}". Certifique-se de registrar um validador apropriado.`,
      );
    }

    validator.validate(middleware);
  }

  /**
   * Determina o tipo de hookEvent.
   * @param hookEvent - O evento a ser validado.
   * @returns O tipo do hookEvent como string.
   * @throws Lança erro se o hookEvent não for uma string ou RegExp.
   */
  private getHookEventType(hookEvent: unknown): string {
    if (typeof hookEvent === "string") {
      return "string";
    }
    if (hookEvent instanceof RegExp) {
      return "regexp";
    }
    throw new mongooseErrors.InvalidHookEventError(
      [{ hookEvent }],
      `Tipo de hookEvent inválido: esperado "string" ou "RegExp", mas recebido "${typeof hookEvent}".`,
    );
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
 * Verifica se o erro é conhecido e deve ser reencaminhado.
 * @param error - O erro a ser verificado.
 * @returns Verdadeiro se o erro for conhecido, falso caso contrário.
 */
export const isKnownError = (error: unknown): boolean => {
  return error instanceof Conflict || error instanceof NotFound;
};

/**
 * Wrapper para centralizar o tratamento de erros.
 * Este método encapsula a execução de uma função e delega o tratamento de erros
 * ao serviço de tratamento de erros injetado.
 * @param fn - Função a ser executada.
 * @param errorHandler - Serviço de tratamento de erros.
 * @param collection - Nome da coleção associada ao erro.
 * @returns O resultado da função, se bem-sucedida.
 * @throws Lança um erro tratado pelo errorHandler.
 */
export const withErrorHandling = <T>(
  fn: () => T,
  errorHandler: IMongooseErrorHandler,
  collection: string,
): T => {
  try {
    return fn();
  } catch (error: unknown) {
    errorHandler.handle(error, collection);
  }
};

/**
 * Wrapper centralizado para aplicar o withErrorHandling.
 * @param fn - Função a ser executada.
 * @param errorHandler - Serviço de tratamento de erros.
 * @param context - Contexto associado ao erro.
 * @returns O resultado da função, se bem-sucedida.
 */
export const handleWithErrorHandling = <T>(
  fn: () => T,
  errorHandler: IMongooseErrorHandler,
  context: string,
): T => {
  return withErrorHandling(fn, errorHandler, context);
};

/**
 * Valida se o array de middlewares é válido.
 * @param middlewares - Array de middlewares a ser validado.
 * @throws Lança um erro específico se algum middleware for inválido.
 */
export const validateMiddlewares = (middlewares?: MiddlewareConfig[]): void => {
  if (!middlewares || middlewares.length === 0) {
    return;
  }
  middlewares.forEach((middleware, index) => {
    if (!middleware || typeof middleware !== "object") {
      throw new mongooseErrors.InvalidMiddlewareError(
        [{ index, middleware }],
        `Middleware inválido na posição ${index}: esperado um objeto válido.`,
      );
    }
    if (!middleware.method || !middleware.hookEvent || !middleware.fn) {
      throw new mongooseErrors.InvalidMiddlewareError(
        [{ index, middleware }],
        `Middleware inválido na posição ${index}: propriedades obrigatórias ausentes.`,
      );
    }
  });
};

/**
 * Helper para verificar se o schema precisa ser clonado antes de aplicar middlewares.
 * @param middlewares - Lista de middlewares a serem aplicados.
 * @returns Verdadeiro se o schema precisar ser clonado, falso caso contrário.
 */
export const shouldCloneSchema = (middlewares: MiddlewareConfig[]): boolean => {
  return middlewares.length > 0;
};

/**
 * Constante para identificar o contexto de erros no MongooseModelRegister.
 */
export const MONGOOSE_MODEL_REGISTER_CONTEXT = "MongooseModelRegister";

/**
 * Abstração para o Schema do Mongoose.
 */
export const MongooseSchema = Schema;
/**
 * Abstração para o Model do Mongoose.
 */
export const mongooseModel = model;
