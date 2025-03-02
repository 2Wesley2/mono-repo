import { Model as MongooseModel, Document as MongooseDocument } from "mongoose";

export interface IMongooseModel<T extends MongooseDocument = MongooseDocument> {
  model: MongooseModel<MongooseDocument & T>;
  attachCustomMethods(): void;
}
