import mongoose, { Schema, model } from "mongoose";
import type { Schema as TSchema, Model, SchemaDefinition } from "mongoose";
import type {
  RegisterDocumentParams,
  MiddlewareConfig,
  options,
} from "#mongoose-wrapper";

export type ToObjectId = (id: string) => mongoose.Types.ObjectId;

export class RegisterMiddlewaresConfigurator {
  constructor(
    public schema: TSchema,
    public middlewares: MiddlewareConfig[],
  ) {
    if (!Array.isArray(this.middlewares)) {
      throw new Error(
        "Middlewares deve ser um array do tipo MiddlewareConfig.",
      );
    }
    this.middlewares.forEach((mw: MiddlewareConfig) => {
      if (mw.method !== "pre" && mw.method !== "post") {
        throw new Error(`Método de middleware inválido`);
      }
      if (mw.method === "pre") {
        this.schema.pre(mw.hookEvent, mw.fn);
      } else if (mw.method === "post") {
        this.schema.post(mw.hookEvent, mw.fn);
      }
    });
  }
}

export class RegisterModelConfigurator<U> {
  public newModel: Model<U>;
  constructor(collection: string, schema: TSchema<U>) {
    try {
      this.newModel = model<U>(collection, schema);
    } catch (error: Error | any) {
      if (error.name === "OverwriteModelError") {
        throw new Error(
          `Erro: o modelo "${collection}" já foi registrado (OverwriteModelError).`,
        );
      }
      if (error.name === "MissingSchemaError") {
        throw new Error(
          `Erro: esquema não encontrado para o modelo "${collection}" (MissingSchemaError).`,
        );
      }
      throw new Error(
        `Erro ao registrar o modelo "${collection}": ${error.message}`,
      );
    }
  }
}

export class RegisterDocumentConfigurator<U> {
  public schema: TSchema<U>;
  private collection: string;
  private options: options;
  private middlewares: MiddlewareConfig[];
  public model: Model<U>;

  constructor(params: RegisterDocumentParams<U>) {
    try {
      if (
        !params.schemaDefinition ||
        typeof params.schemaDefinition !== "object"
      ) {
        throw new Error("Definição de schema inválida.");
      }
      this.collection = params.collection;
      this.options = { timestamps: true, ...params.options };
      this.middlewares = params.middlewares || ([] as MiddlewareConfig[]);
      this.schema = new Schema<U>(params.schemaDefinition, this.options);
      if (this.middlewares.length > 0) {
        new RegisterMiddlewaresConfigurator(this.schema, this.middlewares);
      }
      this.model = new RegisterModelConfigurator<U>(
        this.collection,
        this.schema,
      ).newModel;
    } catch (error: unknown | any) {
      throw new Error(
        `Erro ao configurar o documento para a coleção "${params.collection}": ${error.message}`,
      );
    }
  }
}

export class MongooseModelRegister {
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
    return new RegisterMiddlewaresConfigurator(schema, middlewares).schema;
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
      return new RegisterDocumentConfigurator<U>({
        schemaDefinition: schema,
        collection: collection,
        options: options,
        middlewares: middlewares,
      }).model;
    } catch (error: unknown | any) {
      throw new Error(
        `Erro ao registrar o documento "${collection}": ${error.message}`,
      );
    }
  }
}
