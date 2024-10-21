import Service from '../../core/Service.js';
import AuthMiddleware from '../../../middlewares/authMiddleware.js';
import { USER } from '../../constants/index.js';
import config from '../../../config/index.js';
import debug from '../../../debug/index.js';
class UserService extends Service {
  constructor(repository) {
    super(repository, USER);
    this.secretKey = config.jwtSecret;
  }

  async login(username, password) {
    try {
      const user = await this.repository.login(username, password);
      if (!user) {
        debug.logger.warn(`UserService.js: Login failed for user: ${username}`);
        throw new Error('UserService.js: Usuário ou senha inválidos');
      }
      const token = AuthMiddleware.generateToken(user);
      debug.logger.info(`UserService.js: ${username} logado com sucesso`);
      return { user, token };
    } catch (error) {
      debug.logger.error(`UserService.js: Erro ao tentar logar ${username}: ${error.message}`);
      throw error;
    }
  }
}
export default UserService;
