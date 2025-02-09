import Model from '#src/core/infrastructure/components/base/Model.js';
import auth from '#core/adapters/auth/authentication/index.js';
import { InvalidRequestError } from '#src/errors/Exceptions.js';
import { convertDatesToStrings } from '#src/helpers/stringHelper.js';

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
  state: { type: String, required: true }
};

export default class PersonModel extends Model {
  constructor(schema = {}, modelName, options = {}, middlewares = []) {
    const combinedSchema = { ...personSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  async signUp(userData) {
    const hashedPassword = await auth.hash(userData.password);
    userData.password = hashedPassword;
    const created = await this.model.create(userData);
    if (!created) {
      throw new InvalidRequestError();
    }
    const plainObj = created.toObject();
    plainObj._id = plainObj._id.toString();
    const analise = Model.analyzeObject(plainObj);
    console.log(analise);
    return plainObj;
  }
}
