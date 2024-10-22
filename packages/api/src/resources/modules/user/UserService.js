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

  async create(data) {
    try {
      if (!data.username || !data.password) {
        throw new Error('Username e password são obrigatórios');
      }

      debug.logger.info('UserService.js: criando usuário');
      const user = await this.repository.create(data);
      debug.logger.info(`UserService.js: Usuário ${data.username} criado com sucesso`);
      return user;
    } catch (error) {
      debug.logger.error(`UserService.js: Erro ao criar usuário ${data.username}: ${error.message}`);
      throw error;
    }
  }

  async login(username, password) {
    try {
      debug.logger.info(`UserService: Iniciando login para ${username}`);
      const user = await this.repository.login(username, password);
      if (!user) {
        debug.logger.warn(`UserService: Login falhou para ${username}. Usuário ou senha inválidos.`);
        throw new Error('UserService.js: Usuário ou senha inválidos');
      }
      const token = AuthMiddleware.generateToken(user);
      debug.logger.info(`UserService: Login bem-sucedido para ${username}. Token gerado.`);
      return { user, token };
    } catch (error) {
      debug.logger.error(`UserService: Erro ao tentar logar ${username}. Erro: ${error.message}`);
      throw error;
    }
  }
}
export default UserService;
