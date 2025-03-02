import { Model } from "#model";
import type { IPersonModel } from "./type-person.ts";

const personSchema = {
  cpf: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  street: { type: String, required: true },
  neighborhood: { type: String, required: true },
  houseNumber: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
};

export class PersonModel extends Model implements IPersonModel {
  constructor(schema = {}, modelName: string, options = {}, middlewares = []) {
    const combinedSchema = { ...personSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  async signUp(data: Record<string, any>): Promise<any> {
    return this.model.create(data);
  }
}
