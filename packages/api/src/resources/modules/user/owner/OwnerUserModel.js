import UserModel from '../model/UserModel.js';
import { OWNER_USER, ROLE } from '../../../collections/index.js';
import { UnauthorizedError } from '#src/errors/Exceptions.js';

const ownerUserSchema = {
  name: { type: String, required: true },
  role: { type: String, ref: ROLE, required: true },
};

export default class OwnerUserModel extends UserModel {
  constructor() {
    super(ownerUserSchema, OWNER_USER);
  }

  async signUp(userData) {
    const roleOwner = { role: 'owner' };
    return await super.signUp({ ...userData, ...roleOwner });
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
