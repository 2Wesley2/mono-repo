import mongoose, {
  Schema,
  SchemaDefinition,
  SchemaOptions,
  Model,
  model,
  Document,
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

export type NewDocMongoose<TDoc extends Document = Document> = Model<TDoc>;
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

export interface RegisterMiddlewares {}
export class RegisterMiddlewaresConfigurator<T extends Schema>
  implements RegisterMiddlewares
{
  constructor(
    public readonly schema: T,
    private readonly middlewares: MiddlewareConfig[],
  ) {
    this.registerMiddlewares();
  }

  private registerMiddlewares(): Schema {
    this.middlewares.forEach((mw) => {
      if (mw.method === "pre") {
        this.schema.pre(mw.hookEvent, mw.fn);
      } else if (mw.method === "post") {
        this.schema.post(mw.hookEvent, mw.fn);
      }
    });
    return this.schema;
  }
}

export interface RegisterModel {}
export class RegisterModelConfigurator<T extends Document>
  implements RegisterModel
{
  public newModel: Model<T>;

  constructor(
    private readonly modelName: string,
    private readonly schema: Schema,
  ) {
    this.newModel = this.registerModel();
  }

  private registerModel(): Model<T> {
    try {
      return model<T>(this.modelName, this.schema);
    } catch (error: Error | any) {
      if (error.name === "OverwriteModelError") {
        throw new Error(
          `Erro: o modelo "${this.modelName}" já foi registrado (OverwriteModelError).`,
        );
      }
      if (error.name === "MissingSchemaError") {
        throw new Error(
          `Erro: esquema não encontrado para o modelo "${this.modelName}" (MissingSchemaError).`,
        );
      }
      throw new Error(
        `Erro ao registrar o modelo "${this.modelName}": ${error.message}`,
      );
    }
  }
}

export interface RegisterDocumentParams<TDoc extends Document = Document> {
  readonly schema: SchemaDefinition;
  readonly modelName: string;
  readonly options?: options;
  readonly middlewares?: MiddlewareConfig[];

  readonly __docType?: TDoc;
}

export interface RegisterDocument {}
export class RegisterDocumentConfigurator<
  TDoc extends Document,
  T extends RegisterDocumentParams<TDoc>,
> implements RegisterDocument
{
  public model: NewDocMongoose<TDoc>;
  constructor(
    private readonly schema: T["schema"],
    private readonly modelName: T["modelName"],
    private readonly options?: T["options"],
    private readonly middlewares?: T["middlewares"],
  ) {
    this.model = this.registerDocument();
  }

  private registerDocument(): NewDocMongoose<TDoc> {
    const schema = new Schema(this.schema, this.options);
    if (this.middlewares) {
      new RegisterMiddlewaresConfigurator(schema, this.middlewares);
    }
    return new RegisterModelConfigurator<TDoc>(this.modelName, schema).newModel;
  }
}
