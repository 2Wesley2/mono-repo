import bcrypt from 'bcryptjs';
import Model from '../../../core/entities/system/base/Model.js';
import { USER, ROLE } from '../../collections/index.js';

const userSchema = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Model.objectIdType, ref: ROLE, required: true },
};
class UserModel extends Model {
  constructor() {
    super(userSchema, USER);
  }

  async getRoleByUser(userID) {
    try {
      const user = await this.model.findById(userID).populate('role');
      return user.role._id;
    } catch (error) {
      console.error(`[UserModel] Erro ao buscar role para userID ${userID}: ${error.message}`);
      throw error;
    }
  }

  async createUser(data) {
    try {
      const { username, password, role } = data;
      const hashedPassword = await bcrypt.hash(password, 12);
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
}

export default UserModel;
