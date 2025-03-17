import { SchemaDefinition } from "mongoose";
import { Model } from "#model";
import type { RegisterDocumentParams } from "#mongoose-wrapper";
import type { SPerson } from "../contract/index";

const personSchema: SchemaDefinition<SPerson> = {
  cpf: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  birthDate: { type: Date },
  street: { type: String },
  neighborhood: { type: String },
  houseNumber: { type: String },
  postalCode: { type: String },
  city: { type: String },
  state: { type: String },
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
