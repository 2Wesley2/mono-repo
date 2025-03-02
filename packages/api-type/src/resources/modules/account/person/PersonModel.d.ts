import { Model } from "../../../../components/Model/model.ts";
import type { IPersonModel } from "./type-person.ts";

declare module "person-model" {
  export default class PersonModel extends Model implements IPersonModel {
    constructor(
      schema: Record<string, any>,
      modelName: string,
      options?: any,
      middlewares?: any[],
    );
    signUp(userData: Record<string, any>): Promise<any>;
  }
}
