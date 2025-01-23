import auth from '#core/adapters/auth/index.js';
import Model from '#core/infrastructure/database/components/base/Model.js';
import { USER } from '../../../collections/index.js';

const userSchema = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

export default class UserModel extends Model {
  constructor(schema = {}, modelName = USER, options = {}, middlewares = []) {
    const isSchemaEmpty = !schema || Object.keys(schema).length === 0;
    const combinedSchema = isSchemaEmpty ? userSchema : { ...userSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
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
}
