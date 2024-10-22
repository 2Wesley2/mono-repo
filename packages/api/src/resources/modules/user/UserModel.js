import bcrypt from 'bcryptjs';
import debug from '../../../debug/index.js';
import Model from '../../core/Model.js';
import { USER } from '../../constants/index.js';

const userSchema = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' },
};
class UserModel extends Model {
  constructor() {
    super(userSchema, USER);
  }

  async create(data) {
    try {
      const { username, password, role } = data;
      const hashedPassword = await bcrypt.hash(password, 12);
      debug.logger.info('UserModel.js: criando usuário');
      const user = await this.model.create({ username, password: hashedPassword, role });
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
      debug.logger.info(`UserModel: Buscando usuário ${username} no banco de dados`);
      const user = await this.model.findOne({ username });
      const isMatch = await this.comparePassword(password, user.password);
      if (!isMatch || !user) {
        debug.logger.warn(`UserModel: Senha inválida para usuário ${username}`);
        throw new Error('Senha ou usuário inválido');
      }
      debug.logger.info(`UserModel: Login realizado com sucesso para ${username}`);
      return user;
    } catch (error) {
      debug.logger.error(`UserModel: Erro ao realizar login para ${username}. Erro: ${error.message}`);
      throw error;
    }
  }
}

export default UserModel;
