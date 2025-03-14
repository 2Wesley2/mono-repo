import { SchemaDefinition } from "mongoose";
import { Model } from "#model";
import type { RegisterDocumentParams } from "#mongoose-wrapper";
import type { SPerson } from "../contract/index";

const personSchema: SchemaDefinition<SPerson> = {
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

export class PersonModel<T extends SPerson = SPerson> extends Model<T> {
  constructor(
    schema: RegisterDocumentParams<T>["schemaDefinition"],
    modelName: RegisterDocumentParams<T>["collection"] = "Person",
    options: RegisterDocumentParams<T>["options"],
    middlewares: RegisterDocumentParams<T>["middlewares"],
  ) {
    const combinedSchema = { ...personSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  public async signUp(data: T): Promise<any> {
    return await this.model.create(data);
  }
}
