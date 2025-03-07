import {
  Model as MongooseModel,
  Document as MongooseDocument,
  SchemaDefinition,
} from "mongoose";
import { IMongooseModel } from "./type-model.ts";
import type {
  MiddlewareConfig,
  options,
} from "../../libs/mongoose/type-mongoose-wrapper.ts";
declare module "model" {
  export class MongooseModelWrappe implements IMongooseModel {
    public model: MongooseModel<MongooseDocument>;
    constructor(
      schema: SchemaDefinition,
      modelName: string,
      options?: options,
      middlewares?: MiddlewareConfig[],
    );

    attachCustomMethods(): void;
  }
}
