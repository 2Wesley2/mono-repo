import PersonModel from '../../person/PersonModel.js';
import user from '#core/entities/domain/user/User.js';
import auth from '#core/adapters/auth/index.js';
import { UnauthorizedError, InvalidRequestError } from '#src/errors/Exceptions.js';
import logger from '#src/debug/logger.js';

const userSchema = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
};

export default class UserModel extends PersonModel {
  constructor(schema = {}, modelName, options = {}, middlewares = []) {
    const combinedSchema = { ...userSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  validateSession(token) {
    try {
      const decoded = auth.authentication.isAuthenticate(token);
      if (!decoded) {
        throw new UnauthorizedError();
      }
      return { loggedIn: true };
    } catch (error) {
      return { loggedIn: false };
    }
  }

  async signUp(userData) {
    const hashedPassword = await auth.authentication.hash(userData.password);
    userData.password = hashedPassword;
    return await super.signUp(userData);
  }

  async login({ email, password }) {
    const areCredentialsValid = user.validateRequiredFields({
      email,
      password
    });
    const userRecord = await this.getUserByEmail(email);

    const passwordComparison = {
      password: password,
      hashedPassword: userRecord.password
    };

    const isPasswordValid = areCredentialsValid ? await auth.authentication.authenticate(passwordComparison) : null;

    if (!userRecord || !isPasswordValid) {
      throw new UnauthorizedError();
    }
    return userRecord;
  }

  async getUserByEmail(email) {
    const user = await this.model.findOne({ email }).lean();
    return user;
  }
}
