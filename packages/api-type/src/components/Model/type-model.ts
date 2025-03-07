import { Model as MongooseModel, Document as MongooseDocument } from "mongoose";
export interface IMongooseModel {
  model: MongooseModel<MongooseDocument>;
  attachCustomMethods(): void;
}
