import mongoose, {
  Schema,
  SchemaDefinition,
  SchemaOptions,
  Model,
  Document,
  models,
} from "mongoose";

export type Default = {};
export type NewDocMongoose<TDoc extends Document = Document> = Model<TDoc>;
export type options = SchemaOptions<any, any, any, any, Default>;
export type MiddlewareConfig = {
  readonly method: "pre" | "post";
  readonly hookEvent: RegExp;
  readonly fn: (...args: any[]) => void | Promise<void>;
};

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
  public model: Model<T>;

  constructor(
    private readonly modelName: string,
    private readonly schema: Schema,
  ) {
    this.model = this.registerModel();
  }

  private registerModel(): Model<T> {
    if (models[this.modelName]) {
      console.log(`Modelo "${this.modelName}" já está registrado.`);
      return models[this.modelName];
    }
    return mongoose.model<T>(this.modelName, this.schema);
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
    return new RegisterModelConfigurator<TDoc>(this.modelName, schema).model;
  }
}
