import {
  Model as MongooseModel,
  Document as MongooseDocument,
  SchemaOptions,
} from "mongoose";
import type { Middleware } from "../../libs/mongoose/type-mongoose-wrapper.ts";
import { IMongooseModel } from "./type-model.ts";

declare module "model" {
  export class MongooseModelWrapper<
    T extends MongooseDocument = MongooseDocument,
  > implements IMongooseModel<T>
  {
    public model: MongooseModel<MongooseDocument & T>;
    constructor(
      schema: Record<string, any>,
      modelName: string,
      options?: SchemaOptions,
      middlewares?: Middleware[],
    );
    static isValidObjectId(id: string): boolean;
    static get getTypes(): any;
    static get objectIdType(): any;
    attachCustomMethods(): void;
  }
}
