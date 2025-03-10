import mongoose, {
  Schema,
  SchemaDefinition,
  SchemaOptions,
  Model,
  model,
  Document as MongooseDocument,
} from "mongoose";

export type Default = {};

export type ConnectionDBType = (dbName?: string | undefined) => Promise<void>;

export type ConnectionEvents<ErrorType = Error> = Record<
  | "connecting"
  | "connected"
  | "open"
  | "disconnecting"
  | "disconnected"
  | "close"
  | "reconnected",
  () => void
> & {
  error: (err: ErrorType) => void;
};

export type RegisterConnectionEventsFunction = <ErrorType = Error>(
  events: ConnectionEvents<ErrorType>,
) => void;

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

export type NewDocMongoose<TDoc extends MongooseDocument = MongooseDocument> =
  Model<TDoc>;
export type options = SchemaOptions<any, any, any, any, Default>;
export type hookEventPre = "createCollection" | RegExp;
export type hookEventPost =
  | "createCollection"
  | "insertMany"
  | "bulkWrite"
  | RegExp;

export type PreMiddlewareConfig = {
  readonly method: "pre";
  readonly hookEvent: hookEventPre;
  readonly fn: (...args: any[]) => void | Promise<void>;
};

export type PostMiddlewareConfig = {
  readonly method: "post";
  readonly hookEvent: hookEventPost;
  readonly fn: (...args: any[]) => void | Promise<void>;
};

export type MiddlewareConfig = PreMiddlewareConfig | PostMiddlewareConfig;

export class RegisterMiddlewaresConfigurator {
  constructor(
    public schema: Schema,
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

// Classe que registra o modelo a partir de um Schema já criado
export class RegisterModelConfigurator<U> {
  public newModel: Model<U>;
  constructor(collection: string, schema: Schema<U>) {
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

export interface RegisterDocumentParams<U> {
  schemaDefinition: SchemaDefinition<U>;
  collection: string;
  options?: options;
  middlewares: MiddlewareConfig[];
}

export class RegisterDocumentConfigurator<U> {
  public schema: Schema<U>;
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
