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

export class RegisterMiddlewaresConfigurator {
  constructor(
    public readonly schema: Schema,
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

export class RegisterModelConfigurator {
  public newModel: Model<MongooseDocument>;
  constructor(
    private readonly modelName: string,
    private readonly schema: Schema,
  ) {
    this.newModel = this.registerModel();
  }

  private registerModel(): Model<MongooseDocument> {
    try {
      return model<MongooseDocument>(this.modelName, this.schema);
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

export interface RegisterDocumentParams {
  readonly schema: SchemaDefinition;
  readonly modelName: string;
  readonly options?: options;
  readonly middlewares: MiddlewareConfig[];
}

export class RegisterDocumentConfigurator {
  public model: Model<MongooseDocument>;
  constructor(
    private readonly schema: RegisterDocumentParams["schema"],
    private readonly modelName: RegisterDocumentParams["modelName"],
    private readonly options?: RegisterDocumentParams["options"],
    private readonly middlewares?: RegisterDocumentParams["middlewares"],
  ) {
    this.model = this.registerDocument();
  }

  private registerDocument(): Model<MongooseDocument> {
    const schema = new Schema(this.schema, this.options || {});
    if (this.middlewares && this.middlewares.length > 0) {
      new RegisterMiddlewaresConfigurator(schema, this.middlewares);
    }
    return new RegisterModelConfigurator(this.modelName, schema).newModel;
  }
}
