import { SchemaDefinition } from "mongoose";
import { Model } from "#model";
import type { RegisterDocumentParams } from "mongoose-wrapper";

export interface IPerson {
  cpf: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  street: string;
  neighborhood: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  state: string;
}
const personSchema: SchemaDefinition<IPerson> = {
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

export class PersonModel extends Model {
  constructor(
    schema: RegisterDocumentParams["schema"],
    modelName: RegisterDocumentParams["modelName"],
    options: RegisterDocumentParams["options"] = {},
    middlewares: RegisterDocumentParams["middlewares"] = [],
  ) {
    const combinedSchema = { ...personSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  public async signUp(data: IPerson): Promise<any> {
    return this.model.create(data);
  }
}
