import type {
  Schema,
  SchemaDefinition,
  Model,
  Document as MongooseDocument,
} from "mongoose";
import type {
  MiddlewareConfig,
  RegisterMiddlewaresConfigurator,
  options,
} from "./type-mongoose-wrapper";

declare module "mongoose-wrapper" {
  export class MongooseWrapper {
    public static addMiddleware(
      schema: Schema,
      middlewares: MiddlewareConfig[],
    ): RegisterMiddlewaresConfigurator<Schema>;

    public static registerDocument(
      schema: SchemaDefinition,
      modelName: string,
      options: options,
      RegisterMiddlewares: MiddlewareConfig[],
    ): Model<MongooseDocument>;

    public static connectDB(dbName?: string): Promise<void>;

    public static disconnectDB(): Promise<void>;
  }
}
