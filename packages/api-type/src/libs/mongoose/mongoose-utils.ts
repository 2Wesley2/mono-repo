import mongoose, { Schema, model } from "mongoose";
import type { Model, SchemaTimestampsConfig } from "mongoose";
import type {
  RegisterConnectionEventsFunction,
  ConnectionEvents,
  MiddlewareConfig,
  RegisterDocumentParams,
  options,
  ToObjectId,
} from "#mongoose-wrapper/mongoose-types";
import mongooseErrors from "#errors-mongoose";
import { Validation } from "#contract-mongoose";
import type { IMongooseErrorHandler } from "#contract-mongoose";

export const getMongooseReservedMethods = (): Set<string> => {
  const dummyModel = {} as Model<any>;
  return new Set(Object.getOwnPropertyNames(dummyModel));
};

export const toObjectId: ToObjectId = (id) => {
  if (typeof id === "number") {
    return mongoose.Types.ObjectId.createFromTime(id);
  }
  return new mongoose.Types.ObjectId(id.toString());
};

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

/**
 * Valida se o hookEvent é válido.
 * @param hookEvent - O evento de hook a ser validado.
 * @param validEvents - Lista de eventos válidos.
 * @param errorMessage - Mensagem de erro para eventos inválidos.
 * @throws Lança um erro se o hookEvent for inválido.
 */
export const validateHookEvent = (
  hookEvent: string | RegExp,
  validEvents: (string | RegExp)[],
  errorMessage: string,
): void => {
  if (!(hookEvent instanceof RegExp || validEvents.includes(hookEvent))) {
    throw new mongooseErrors.InvalidHookEventError(
      [{ hookEvent }],
      errorMessage,
    );
  }
};

/**
 * Helper para lançar erros de validação.
 * Centraliza a lógica de construção e lançamento de erros.
 * @param errorClass - Classe de erro a ser lançada.
 * @param context - Contexto associado ao erro.
 * @param details - Detalhes adicionais do erro.
 * @param message - Mensagem de erro.
 */
export const throwValidationError = (
  errorClass: typeof mongooseErrors.GenericMongooseError,
  context: string,
  details: Array<object>,
  message: string,
): never => {
  throw new errorClass(context, details, message);
};

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
 * Contexto para validação de parâmetros de registro de documentos.
 */
export class ValidationContext {
  private validations: Validation[] = [];

  public addValidation(validation: Validation): void {
    this.validations.push(validation);
  }

  public validate(params: RegisterDocumentParams<any>): void {
    this.validations.forEach((validation) => validation.validate(params));
  }
}

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
 * Helper para verificar se o schema precisa ser clonado antes de aplicar middlewares.
 * @param middlewares - Lista de middlewares a serem aplicados.
 * @returns Verdadeiro se o schema precisar ser clonado, falso caso contrário.
 */
export const shouldCloneSchema = (
  middlewares: MiddlewareConfig[] = [],
): boolean => {
  return middlewares.length > 0;
};

/**
 * Abstração para o Schema do Mongoose.
 */
export const MongooseSchema = Schema;
/**
 * Abstração para o Model do Mongoose.
 */
export const mongooseModel = model;

/**
 * Verifica se uma expressão regular é válida.
 * @param regex - A expressão regular a ser validada.
 * @returns Verdadeiro se a expressão for válida, falso caso contrário.
 */
export const isValidRegExp = (regex: RegExp): boolean => {
  try {
    new RegExp(regex.source);
    return true;
  } catch {
    return false;
  }
};
