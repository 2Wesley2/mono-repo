import type { Schema, Model, SchemaDefinition } from "mongoose";
import {
  RegisterMiddlewaresConfigurator,
  RegisterDocumentConfigurator,
} from "#mongoose-wrapper";
import type { MiddlewareConfig, options } from "#mongoose-wrapper";

export class MongooseModelRegister {
  static addMiddleware(
    schema: Schema,
    middlewares: MiddlewareConfig[],
  ): Schema {
    return new RegisterMiddlewaresConfigurator(schema, middlewares).schema;
  }

  static registerDocument<U>(
    schema: SchemaDefinition<U>,
    modelName: string,
    options: options,
    middlewares: MiddlewareConfig[],
  ): Model<U> {
    return new RegisterDocumentConfigurator<U>({
      schemaDefinition: schema,
      collection: modelName,
      options: options,
      middlewares: middlewares,
    }).model;
  }
}
