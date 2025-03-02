import { IMongooseModel } from "#model-type";

export interface IPersonModel extends IMongooseModel {
  signUp(data: Record<string, any>): Promise<any>;
}
