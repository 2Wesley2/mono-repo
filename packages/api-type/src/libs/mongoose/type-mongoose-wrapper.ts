import {
  Schema,
  Model,
  Document as MongooseDocument,
  PreMiddlewareFunction,
  PostMiddlewareFunction,
  SchemaOptions,
  MongooseDocumentMiddleware,
  MongooseQueryMiddleware,
} from "mongoose";

export interface Middleware {
  type: "pre" | "post";
  event: MongooseDocumentMiddleware | MongooseQueryMiddleware;
  fn: PreMiddlewareFunction<any> | PostMiddlewareFunction<any>;
}

export interface AddMiddleware {
  addMiddleware(
    schema: Schema,
    type: "pre" | "post",
    event: MongooseDocumentMiddleware | MongooseQueryMiddleware,
    fn: PreMiddlewareFunction<any> | PostMiddlewareFunction<any>,
  ): void;
}

export interface ConfigSchema {
  configSchema(params: {
    schema: Record<string, any>;
    options?: SchemaOptions;
    middlewares?: Middleware[];
  }): Schema;
}

export interface SubSchemaParams {
  definition: object;
  options?: object;
  middlewares?: Middleware[];
}

export interface SubSchema {
  subSchema(
    definition: SubSchemaParams["definition"],
    options?: SubSchemaParams["options"],
    middlewares?: SubSchemaParams["middlewares"],
  ): Schema;
}

export interface RegisterModelParams {
  schema: Record<string, any>;
  modelName: string;
  options?: SchemaOptions;
  middlewares?: Middleware[];
}

export interface RegisterModel {
  registerModel<T extends MongooseDocument>(
    params: RegisterModelParams,
  ): Model<MongooseDocument & T>;
}
