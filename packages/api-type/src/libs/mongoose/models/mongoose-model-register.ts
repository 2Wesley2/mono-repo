import type {
  Model as TModel,
  Schema as TSchema,
  SchemaDefinition,
} from "mongoose";
import { mongooseModel as model } from "#mongoose-wrapper/common/mongoose-common";
import { handleWithErrorHandling } from "#mongoose-wrapper/utils/mongoose-error-handlers";
import type {
  MiddlewareConfig,
  Options,
} from "#mongoose-wrapper/common/mongoose-types";
import type {
  IMongooseModelRegister,
  IModelRegister,
  IMongooseErrorHandler,
} from "#contract-mongoose";
import { SchemaBuilder } from "#mongoose-wrapper/schemas/mongoose-schema-config";

export class ModelFactory<U> {
  public create(collection: string, schema: TSchema<U>): TModel<U> {
    return model<U>(collection, schema);
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

  public register(collection: string, schema: TSchema<U>): TModel<U> {
    return handleWithErrorHandling(
      () => this.modelFactory.create(collection, schema),
      this.errorHandler,
      collection,
    );
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

  constructor(
    schemaBuilder: SchemaBuilder<U>,
    modelRegister: IModelRegister<U>,
  ) {
    this.schemaBuilder = schemaBuilder;
    this.modelRegister = modelRegister;
  }

  /**
   * Adiciona middlewares a um schema do Mongoose.
   * @param schema - O schema do Mongoose ao qual os middlewares serão adicionados.
   * @param middlewares - Um array de configurações de middlewares.
   * @returns O schema atualizado com os middlewares aplicados.
   */
  public addMiddleware(
    schema: TSchema,
    middlewares: MiddlewareConfig[] = [],
  ): TSchema {
    return this.schemaBuilder.middlewareProcessor.process(schema, middlewares);
  }

  /**
   * Registra um novo modelo do Mongoose com a definição de schema, opções e middlewares fornecidos.
   * @param schemaDefinition - A definição do schema para o modelo.
   * @param collection - O nome da coleção a ser registrada.
   * @param schemaOptions - Opções do schema, incluindo timestamps e outras configurações.
   * @param middlewares - Um array de configurações de middlewares a serem aplicados ao schema.
   * @returns O modelo do Mongoose registrado.
   */
  public registerDocument(
    schemaDefinition: SchemaDefinition<U>,
    collection: string,
    schemaOptions: Options,
    middlewares: MiddlewareConfig[] = [],
  ): TModel<U> {
    const schemaInstance = this.schemaBuilder.build(
      schemaDefinition,
      collection,
      schemaOptions,
      middlewares,
    );
    return this.modelRegister.register(collection, schemaInstance);
  }
}
