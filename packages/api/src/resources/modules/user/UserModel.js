import bcrypt from 'bcryptjs';
import debug from '../../../debug/index.js';
import Model from '../../core/Model.js';
import { USER } from '../../constants/index.js';

const userSchema = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
};
class UserModel extends Model {
  constructor() {
    super(userSchema, USER);
  }

  async create(data) {
    try {
      const { username, password, role } = data;
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await super.create({ username, password: hashedPassword, role });
      debug.logger.info(`UserModel.js: Usuário ${username} criado!`);
      return user;
    } catch (error) {
      debug.logger.error(`UserModel.js: ${error.message}`);
      throw error;
    }
  }

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async login(username, password) {
    try {
      const user = await this.model.findOne({ username });
      const isMatch = await this.comparePassword(password, user.password);
      if (!isMatch || !user) {
        throw new Error('Senha ou usuário inválido');
      }
      debug.logger.info(`UserModel.js: Login realizado com sucesso para ${username}`);
      return user;
    } catch (error) {
      debug.logger.error(`UserModel.js: Erro no login - ${error.message}`);
      throw error;
    }
  }
}

export default UserModel;
