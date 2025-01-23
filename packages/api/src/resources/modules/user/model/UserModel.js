import Model from '#src/core/infrastructure/components/base/Model.js';
import { USER } from '#resources/collections/index.js';
import auth from '#core/adapters/auth/authentication/index.js';
import { UnauthorizedError } from '#src/errors/Exceptions.js';

const userSchema = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

export default class UserModel extends Model {
  constructor(schema = {}, modelName = USER, options = {}, middlewares = []) {
    const isSchemaEmpty = !schema || Object.keys(schema).length === 0;
    const combinedSchema = isSchemaEmpty ? userSchema : { ...userSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  async login(credentials) {
    const { email, password } = credentials;
    const user = await this.getUserByEmail(email);
    const isValidPassword = await auth.authenticate(password, user.password);
    if (!user || !isValidPassword) {
      throw new UnauthorizedError();
    }
    return user;
  }

  async getUserByEmail(email) {
    const user = await this.model.findOne({ email });
    return user;
  }
}
