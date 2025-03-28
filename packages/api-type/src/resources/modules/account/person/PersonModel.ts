import type { SchemaDefinition } from "mongoose";
import type { IPersonModel } from "#contract-account";
import { Model } from "#model";
import type {
  RegisterDocumentParams,
  ToObjectDocument,
} from "#mongoose-wrapper/common/mongoose-types";
import type { SPerson } from "#schema";

const personSchema: SchemaDefinition<SPerson> = {
  cpf: { type: String, unique: true },
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  birthDate: { type: Date, require: true },
  street: { type: String, default: "" },
  neighborhood: { type: String, default: "" },
  houseNumber: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
};

export class PersonModel<T extends SPerson = SPerson>
  extends Model<T>
  implements IPersonModel<T>
{
  constructor(
    schema: RegisterDocumentParams<T>["schemaDefinition"],
    collection: RegisterDocumentParams<T>["collection"] = "Person",
    options: RegisterDocumentParams<T>["options"],
    middlewares: RegisterDocumentParams<T>["middlewares"],
  ) {
    const combinedSchema = { ...personSchema, ...schema };
    super(combinedSchema, collection, options, middlewares);
  }

  public async signUp(data: T): Promise<ToObjectDocument<T>> {
    return (await this.model.create(data)).toObject();
  }
}
