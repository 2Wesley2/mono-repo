import mongoose, { model, Schema } from "mongoose";
import type { Schema as TypeSchema, Model } from "mongoose";
import type {
  MiddlewareConfig,
  options,
  ToObjectId,
  RegisterConnectionEventsFunction,
  ConnectionEvents,
  RegisterDocumentParams,
} from "#mongoose-wrapper";

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

export class RegisterMiddlewaresConfigurator {
  constructor(
    public schema: TypeSchema,
    public middlewares: MiddlewareConfig[],
  ) {
    this.middlewares.forEach((mw) => {
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
  constructor(collection: string, schema: TypeSchema<U>) {
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
  public schema: TypeSchema<U>;
  private collection: string;
  private options: options;
  private middlewares: MiddlewareConfig[];
  public model: Model<U>;

  constructor(params: RegisterDocumentParams<U>) {
    this.collection = params.collection;
    this.options = { timestamps: true, ...params.options };
    this.middlewares = params.middlewares || [];
    this.schema = new Schema<U>(params.schemaDefinition, this.options);
    if (this.middlewares.length > 0) {
      new RegisterMiddlewaresConfigurator(this.schema, this.middlewares);
    }
    this.model = new RegisterModelConfigurator<U>(
      this.collection,
      this.schema,
    ).newModel;
  }
}
