import type { Model, Schema, SchemaDefinition } from "mongoose";
import {
  MongooseSchema,
  MiddlewareContext,
  MiddlewareValidationContext,
  mongooseModel,
  configureOptions,
  applyValidations,
} from "#mongoose-wrapper";
import type {
  RegisterDocumentParams,
  MiddlewareConfig,
  options,
} from "#mongoose-wrapper";
import type {
  IMiddlewareProcessor,
  ISchemaCreator,
  IMongooseModelRegister,
  IModelRegister,
} from "#contract-mongoose";
import { MongooseErrorHandler } from "#mongoose-error-handler";

class MiddlewareProcessor implements IMiddlewareProcessor {
  private context: MiddlewareContext;
  private validationContext: MiddlewareValidationContext;

  constructor() {
    this.context = new MiddlewareContext();
    this.validationContext = new MiddlewareValidationContext();
  }

  public process(schema: Schema, middlewares: MiddlewareConfig[]): Schema {
    try {
      const updatedSchema = schema.clone();
      middlewares.forEach((mw: MiddlewareConfig) => {
        this.validationContext.validate(mw);
        this.context.applyMiddleware(updatedSchema, mw);
      });
      return updatedSchema;
    } catch (error: unknown) {
      throw error;
    }
  }
}

/**
 * Classe responsável por registrar um modelo do Mongoose.
 */
class ModelRegister<U> implements IModelRegister<U> {
  private errorHandler: MongooseErrorHandler;

  constructor(errorHandler: MongooseErrorHandler = new MongooseErrorHandler()) {
    this.errorHandler = errorHandler;
  }

  public register(collection: string, schema: Schema<U>): Model<U> {
    try {
      return mongooseModel<U>(collection, schema);
    } catch (error: unknown) {
      this.errorHandler.handle(error, collection);
    }
  }
}

/**
 * Classe responsável por criar o schema do Mongoose.
 */
class SchemaCreator implements ISchemaCreator {
  private errorHandler: MongooseErrorHandler;

  constructor(errorHandler: MongooseErrorHandler = new MongooseErrorHandler()) {
    this.errorHandler = errorHandler;
  }

  public create<U>(params: RegisterDocumentParams<U>): Schema<U> {
    try {
      applyValidations(params);
      return new MongooseSchema<U>(
        params.schemaDefinition,
        configureOptions(params.options),
      );
    } catch (error: unknown) {
      this.errorHandler.handle(error, "SchemaCreator");
    }
  }
}

/**
 * Classe principal para registro de documentos.
 */
export class MongooseModelRegister implements IMongooseModelRegister {
  private middlewareProcessor: IMiddlewareProcessor;
  private schemaCreator: ISchemaCreator;
  private modelRegister: IModelRegister<any>;
  private errorHandler: MongooseErrorHandler;

  constructor(
    middlewareProcessor: IMiddlewareProcessor = new MiddlewareProcessor(),
    schemaCreator: ISchemaCreator = new SchemaCreator(),
    modelRegister: IModelRegister<any> = new ModelRegister<any>(),
    errorHandler: MongooseErrorHandler = new MongooseErrorHandler(),
  ) {
    this.middlewareProcessor = middlewareProcessor;
    this.schemaCreator = schemaCreator;
    this.modelRegister = modelRegister;
    this.errorHandler = errorHandler;
  }

  /**
   * Adiciona middlewares a um schema do Mongoose.
   * @param schema - O schema do Mongoose ao qual os middlewares serão adicionados.
   * @param middlewares - Um array de configurações de middlewares.
   * @returns O schema atualizado com os middlewares aplicados.
   */
  public addMiddleware(
    schema: Schema,
    middlewares: MiddlewareConfig[],
  ): Schema {
    return this.middlewareProcessor.process(schema, middlewares);
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
  public registerDocument<U>(
    schema: SchemaDefinition<U>,
    collection: string,
    options: options,
    middlewares: MiddlewareConfig[],
  ): Model<U> {
    try {
      const schemaInstance = this.createSchemaInstance(
        schema,
        collection,
        options,
        middlewares,
      );
      return this.modelRegister.register(collection, schemaInstance);
    } catch (error: unknown) {
      this.handleError(error, collection);
    }
  }

  /**
   * Cria uma instância de schema com validações e middlewares aplicados.
   * @param schema - A definição do schema.
   * @param collection - O nome da coleção.
   * @param options - Opções do schema.
   * @param middlewares - Middlewares a serem aplicados.
   * @returns O schema atualizado.
   */
  private createSchemaInstance<U>(
    schema: SchemaDefinition<U>,
    collection: string,
    options: options,
    middlewares: MiddlewareConfig[],
  ): Schema<U> {
    const params: RegisterDocumentParams<U> = {
      schemaDefinition: schema,
      collection,
      options,
      middlewares,
    };

    const schemaInstance = this.schemaCreator.create(params);
    return middlewares.length
      ? this.addMiddleware(schemaInstance, middlewares)
      : schemaInstance;
  }

  /**
   * Trata erros lançados durante o registro do modelo.
   * @param error - O erro capturado.
   * @param collection - O nome da coleção associada ao erro.
   */
  private handleError(error: unknown, collection: string): never {
    if (error instanceof MongooseErrorHandler) {
      throw error;
    }
    this.errorHandler.handle(error, collection);
  }
}
