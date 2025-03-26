import type { Model, Schema, SchemaDefinition } from "mongoose";
import type {
  RegisterDocumentParams,
  MiddlewareConfig,
  options,
} from "#mongoose-wrapper";

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
export interface IMongooseModelRegister {
  addMiddleware(schema: Schema, middlewares: MiddlewareConfig[]): Schema;
  registerDocument<U>(
    schema: SchemaDefinition<U>,
    collection: string,
    options: options,
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
