import type { Model, Schema, SchemaDefinition } from "mongoose";
import {
  MongooseSchema,
  MiddlewareContext,
  MiddlewareValidationContext,
  configureOptions,
  applyValidations,
  withErrorHandling,
  mongooseModel,
  shouldCloneSchema,
  MONGOOSE_MODEL_REGISTER_CONTEXT,
  handleWithErrorHandling,
  validateMiddlewares,
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
  IMongooseErrorHandler,
} from "#contract-mongoose";

export class MiddlewareProcessor implements IMiddlewareProcessor {
  private readonly context: MiddlewareContext;
  private readonly validationContext: MiddlewareValidationContext;

  constructor(
    context: MiddlewareContext,
    validationContext: MiddlewareValidationContext,
  ) {
    this.context = context;
    this.validationContext = validationContext;
  }

  public process(schema: Schema, middlewares?: MiddlewareConfig[]): Schema {
    validateMiddlewares(middlewares); // Permite arrays vazios ou ausentes.
    if (!middlewares || middlewares.length === 0) {
      return schema; // Retorna o schema original se não houver middlewares.
    }

    const updatedSchema = shouldCloneSchema(middlewares)
      ? schema.clone()
      : schema;

    middlewares.forEach((mw: MiddlewareConfig) => {
      this.validationContext.validate(mw);
      this.context.applyMiddleware(updatedSchema, mw);
    });

    return updatedSchema;
  }
}

export class ModelFactory<U> {
  public create(collection: string, schema: Schema<U>): Model<U> {
    return mongooseModel<U>(collection, schema);
  }
}

export class ModelRegister<U> implements IModelRegister<U> {
  private readonly errorHandler: IMongooseErrorHandler;
  private readonly modelFactory: ModelFactory<U>;

  constructor(
    errorHandler: IMongooseErrorHandler,
    modelFactory: ModelFactory<U>,
  ) {
    this.errorHandler = errorHandler;
    this.modelFactory = modelFactory;
  }

  public register(collection: string, schema: Schema<U>): Model<U> {
    return withErrorHandling(
      () => this.modelFactory.create(collection, schema),
      this.errorHandler,
      collection,
    );
  }
}

/**
 * Classe responsável por criar o schema do Mongoose.
 */
export class SchemaCreator implements ISchemaCreator {
  private readonly errorHandler: IMongooseErrorHandler;

  constructor(errorHandler: IMongooseErrorHandler) {
    this.errorHandler = errorHandler;
  }

  public create<U>(params: RegisterDocumentParams<U>): Schema<U> {
    return withErrorHandling(
      () => {
        applyValidations(params);
        return new MongooseSchema<U>(
          params.schemaDefinition,
          configureOptions(params.options),
        );
      },
      this.errorHandler,
      "SchemaCreator",
    );
  }
}

export class SchemaBuilder<U> {
  private readonly schemaCreator: ISchemaCreator;
  public readonly middlewareProcessor: IMiddlewareProcessor;

  constructor(
    schemaCreator: ISchemaCreator,
    middlewareProcessor: IMiddlewareProcessor,
  ) {
    this.schemaCreator = schemaCreator;
    this.middlewareProcessor = middlewareProcessor;
  }

  public build(
    schemaDefinition: SchemaDefinition<U>,
    collection: string,
    options: options,
    middlewares: MiddlewareConfig[],
  ): Schema<U> {
    const params: RegisterDocumentParams<U> = {
      schemaDefinition,
      collection,
      options,
      middlewares,
    };

    const schemaInstance = this.schemaCreator.create(params);
    return middlewares.length
      ? this.middlewareProcessor.process(schemaInstance, middlewares)
      : schemaInstance;
  }
}

/**
 * Classe principal para registro de documentos.
 */
export class MongooseModelRegister<U extends Record<string, any>>
  implements IMongooseModelRegister<U>
{
  private readonly schemaBuilder: SchemaBuilder<U>;
  private readonly modelRegister: IModelRegister<U>;
  private readonly errorHandler: IMongooseErrorHandler;

  constructor(
    schemaBuilder: SchemaBuilder<U>,
    modelRegister: IModelRegister<U>,
    errorHandler: IMongooseErrorHandler,
  ) {
    this.schemaBuilder = schemaBuilder;
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
    return handleWithErrorHandling(
      () => {
        validateMiddlewares(middlewares);
        return this.schemaBuilder.middlewareProcessor.process(
          schema,
          middlewares,
        );
      },
      this.errorHandler,
      MONGOOSE_MODEL_REGISTER_CONTEXT,
    );
  }

  /**
   * Registra um novo modelo do Mongoose com a definição de schema, opções e middlewares fornecidos.
   * @param schema - A definição do schema para o modelo.
   * @param collection - O nome da coleção a ser registrada.
   * @param options - Opções do schema, incluindo timestamps e outras configurações.
   * @param middlewares - Um array de configurações de middlewares a serem aplicados ao schema.
   * @returns O modelo do Mongoose registrado.
   */
  public registerDocument(
    schema: SchemaDefinition<U>,
    collection: string,
    options: options,
    middlewares?: MiddlewareConfig[],
  ): Model<U> {
    return handleWithErrorHandling(
      () => {
        validateMiddlewares(middlewares); // Permite arrays vazios ou ausentes.
        const schemaInstance = this.schemaBuilder.build(
          schema,
          collection,
          options,
          middlewares || [], // Garante que middlewares seja um array.
        );
        return this.modelRegister.register(collection, schemaInstance);
      },
      this.errorHandler,
      MONGOOSE_MODEL_REGISTER_CONTEXT,
    );
  }
}
