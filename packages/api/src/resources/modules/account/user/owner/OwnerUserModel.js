import UserModel from '../model/UserModel.js';
import { OWNER, ROLE } from '../../../../collections/index.js';
import { UnauthorizedError } from '#src/errors/Exceptions.js';

const ownerUserSchema = {
  cnpj: { type: String, required: true, unique: true },
  legalName: { type: String, required: true, unique: true },
  tradeName: { type: String },
  role: { type: String, ref: ROLE, required: true, default: 'owner' },
};

export default class OwnerUserModel extends UserModel {
  constructor(schema = {}, modelName = OWNER, options = {}, middlewares = []) {
    const combinedSchema = { ...ownerUserSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  async signUp(userData) {
    const roleOwner = { role: 'owner' };
    const combinedData = { ...userData, ...roleOwner };
    return await super.signUp(combinedData);
  }

  async login(userCredentials) {
    const userLoggedIn = await super.login(userCredentials);
    if (!userLoggedIn) {
      throw new UnauthorizedError();
    }
    return {
      id: userLoggedIn._id.toString(),
      name: userLoggedIn.name,
      email: userLoggedIn.email,
      role: userLoggedIn.role,
    };
  }

  async getUserByUsername(username) {
    const user = await this.model.findOne({ username });
    return user;
  }

  async getRoleByUser(userID) {
    try {
      const user = await this.model.findById(userID).populate('role');
      return user.role._id;
    } catch (error) {
      console.error(`[OwnerUser] Erro ao buscar role para userID: ${userID}\n ${error.message}`);
      throw error;
    }
  }
}
