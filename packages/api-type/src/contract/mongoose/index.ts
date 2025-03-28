import type { Model, Schema, SchemaDefinition } from "mongoose";
import type {
  RegisterDocumentParams,
  MiddlewareConfig,
  Options,
} from "#mongoose-wrapper/common/mongoose-types";

/**
 * Contrato para a classe MiddlewareProcessor.
 */
export interface IMiddlewareProcessor {
  process(schema: Schema, middlewares: MiddlewareConfig[]): Schema;
}

/**
 * Contrato para a classe SchemaCreator.
 */
export interface ISchemaCreator {
  create<U>(params: RegisterDocumentParams<U>): Schema<U>;
}

/**
 * Contrato para a classe MongooseModelRegister.
 */
export interface IMongooseModelRegister<U extends Record<string, any>> {
  addMiddleware(schema: Schema, middlewares: MiddlewareConfig[]): Schema;
  registerDocument(
    schema: SchemaDefinition<U>,
    collection: string,
    options: Options,
    middlewares: MiddlewareConfig[],
  ): Model<U>;
}

/**
 * Interface para registro de modelos do Mongoose.
 */
export interface IModelRegister<U> {
  register(collection: string, schema: Schema<U>): Model<U>;
}

/**
 * Contrato para o serviço de tratamento de erros do Mongoose.
 */
export interface IMongooseErrorHandler {
  handle(error: unknown, collection: string): never;
}

/**
 * Contrato para o serviço de tratamento de erros.
 */
export interface IErrorHandlerService {
  handle(error: unknown, collection: string): never;
}

/**
 * Contrato para a classe SchemaBuilder.
 */
export interface ISchemaBuilder<U> {
  build(
    schemaDefinition: SchemaDefinition<U>,
    collection: string,
    options: Options,
    middlewares: MiddlewareConfig[],
  ): Schema<U>;
}

/**
 * Contrato para o serviço de validação de middlewares.
 */
export interface IMiddlewareValidatorService {
  hasValidMiddlewares(middlewares?: MiddlewareConfig[]): boolean;
  validateMiddlewares(middlewares?: MiddlewareConfig[]): void;
}

/** Classes abstratas */

/**
 * Define a interface para aplicação de middlewares em schemas.
 */
export abstract class Middleware {
  abstract apply(
    schema: Schema,
    middleware: MiddlewareConfig & { hookEvent: any },
  ): void;
}

/**
 * Validações abstratas para middlewares.
 */
export abstract class MiddlewareValidator {
  abstract validate(middleware: MiddlewareConfig): void;
}

/**
 * Estratégia abstrata para validação de parâmetros de registro de documentos.
 */
export abstract class Validation {
  abstract validate(params: RegisterDocumentParams<any>): void;
}
