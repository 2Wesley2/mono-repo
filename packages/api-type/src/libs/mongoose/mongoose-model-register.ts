import type { Model, Schema, SchemaDefinition } from "mongoose";
import {
  MongooseSchema,
  MiddlewareContext,
  MiddlewareValidationContext,
  mongooseModel,
  ErrorHandlingContext,
  configureOptions,
  applyValidations,
} from "#mongoose-wrapper";
import type {
  RegisterDocumentParams,
  MiddlewareConfig,
  options,
} from "#mongoose-wrapper";

class MiddlewareProcessor {
  private context: MiddlewareContext;
  private validationContext: MiddlewareValidationContext;

  constructor() {
    this.context = new MiddlewareContext();
    this.validationContext = new MiddlewareValidationContext();
  }

  process(schema: Schema, middlewares: MiddlewareConfig[]): Schema {
    const updatedSchema = schema.clone();
    middlewares.forEach((mw: MiddlewareConfig) => {
      this.validationContext.validate(mw);
      this.context.applyMiddleware(updatedSchema, mw);
    });
    return updatedSchema;
  }
}

/**
 * Classe responsável por criar o schema do Mongoose.
 */
class SchemaCreator {
  static create<U>(params: RegisterDocumentParams<U>): Schema<U> {
    applyValidations(params);
    return new MongooseSchema<U>(
      params.schemaDefinition,
      configureOptions(params.options),
    );
  }
}

/**
 * Classe responsável por registrar um modelo do Mongoose.
 */
class ModelRegister<U> {
  private errorContext: ErrorHandlingContext;

  constructor(errorContext: ErrorHandlingContext) {
    this.errorContext = errorContext;
  }

  register(collection: string, schema: Schema<U>): Model<U> {
    try {
      return mongooseModel<U>(collection, schema);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      return this.errorContext.handleError(err, collection);
    }
  }
}

/**
 * Classe principal para registro de documentos.
 */
export class MongooseModelRegister {
  private static errorContext: ErrorHandlingContext;

  /**
   * Adiciona middlewares a um schema do Mongoose.
   * @param schema - O schema do Mongoose ao qual os middlewares serão adicionados.
   * @param middlewares - Um array de configurações de middlewares.
   * @returns O schema atualizado com os middlewares aplicados.
   */
  static addMiddleware(
    schema: Schema,
    middlewares: MiddlewareConfig[],
  ): Schema {
    return new MiddlewareProcessor().process(schema, middlewares);
  }

  /**
   * Registra um novo modelo do Mongoose com a definição de schema, opções e middlewares fornecidos.
   * @param schema - A definição do schema para o modelo.
   * @param collection - O nome da coleção a ser registrada.
   * @param options - Opções do schema, incluindo timestamps e outras configurações.
   * @param middlewares - Um array de configurações de middlewares a serem aplicados ao schema.
   * @returns O modelo do Mongoose registrado.
   * @throws Lança um erro se o registro do modelo falhar.
   */
  static registerDocument<U>(
    schema: SchemaDefinition<U>,
    collection: string,
    options: options,
    middlewares: MiddlewareConfig[],
  ): Model<U> {
    try {
      const params: RegisterDocumentParams<U> = {
        schemaDefinition: schema,
        collection,
        options,
        middlewares,
      };

      const schemaInstance = SchemaCreator.create(params);
      const updatedSchema =
        middlewares.length > 0
          ? this.addMiddleware(schemaInstance, middlewares)
          : schemaInstance;

      return new ModelRegister<U>(this.errorContext).register(
        collection,
        updatedSchema,
      );
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      throw new Error(
        `Erro ao registrar o documento "${collection}": ${err.message}`,
      );
    }
  }
}
