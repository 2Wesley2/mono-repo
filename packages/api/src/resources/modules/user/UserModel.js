import bcrypt from 'bcryptjs';
import Model from '../../core/Model.js';
import { USER } from '../../constants/index.js';
import debug from '../../../debug/index.js';

const userSchema = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' },
};
class UserModel extends Model {
  constructor() {
    super(userSchema, USER);
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
      debug.logger.info(`UserModel: inciando método de login`);
      debug.logger.info(`UserModel: inciando procura pelo ${username} no MongoDB`);
      const user = await this.model.findOne({ username });
      if (!user) {
        debug.logger.warn(`UserModel: ${username} não encontrado`);
        throw { status: 401, message: 'Usuário ou senha inválidos' };
      }
      debug.logger.info(`UserModel: ${username} encontrado!`);
      debug.logger.info(`UserModel: iniciando validação da senha fornecida`);

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
