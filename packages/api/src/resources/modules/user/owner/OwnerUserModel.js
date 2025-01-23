import UserModel from '../model/UserModel.js';
import { OWNER_USER, ROLE } from '../../../collections/index.js';
import auth from '#core/adapters/auth/index.js';
import { UnauthorizedError } from '#src/errors/Exceptions.js';

const ownerUserSchema = {
  name: { type: String, required: true },
  role: { type: UserModel.objectIdType, ref: ROLE, required: true },
};

export default class OwnerUserModel extends UserModel {
  constructor() {
    super(ownerUserSchema, OWNER_USER);
  }

  async login(credentials) {
    const userLoggedIn = await super.login(credentials);
    if (!userLoggedIn) {
      throw new UnauthorizedError();
    }
    return {
      name: userLoggedIn.name,
      email: userLoggedIn.email,
      role: userLoggedIn.role,
    };
  }

  async createUser(data) {
    try {
      const { username, password, role } = data;
      const hashedPassword = await auth.authentication.hash(password);
      const user = await this.model.create({ username, password: hashedPassword, role });
      return user;
    } catch (error) {
      throw error;
    }
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
