import bcrypt from 'bcryptjs';
import Model from '../../components/Model.js';
import { USER, ROLE } from '../../constants/index.js';
import debug from '../../../debug/index.js';
import loaders from '../../../loaders/index.js';

const userSchema = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: loaders.mongoose.getObjectId(), ref: ROLE, required: true },
};
class UserModel extends Model {
  constructor() {
    super(userSchema, USER);
  }

  async getRoleByUser(userID) {
    console.log(`[UserModel] Buscando role para userID: ${userID} (Tipo: ${typeof userID})`);
    try {
      const user = await this.model.findById(userID).populate('role');
      console.log(`[UserModel] Role populada: ${JSON.stringify(user.role._id)} (Tipo: ${typeof user.role._id})`);
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

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async login(username, password) {
    try {
      const user = await this.model.findOne({ username });
      if (!user) {
        throw { status: 401, message: 'Usuário ou senha inválidos' };
      }

      const isMatch = await this.comparePassword(password, user.password);
      if (!isMatch) {
        debug.logger.warn(`UserModel: ${password} inválida`);
        throw { status: 401, message: 'Usuário ou senha inválidos' };
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default UserModel;
