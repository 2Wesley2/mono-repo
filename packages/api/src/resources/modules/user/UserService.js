import AuthMiddleware from '../../../middlewares/authMiddleware.js';
import config from '../../../config/index.js';
import debug from '../../../debug/index.js';
class UserService {
  constructor(repository) {
    this.repository = repository;
    this.secretKey = config.jwtSecret;
  }

  async getRoleByUser(userID) {
    try {
      return await this.repository.getRoleByUser(userID);
    } catch (error) {
      throw error;
    }
  }

  async createUser(data) {
    try {
      if (!data.username || !data.password) {
        throw new Error('Username e password são obrigatórios');
      }

      const user = await this.repository.createUser(data);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(username, password) {
    try {
      debug.logger.info(`UserService: Delegando login para camada de e esperando a resposta`);
      const user = await this.repository.login(username, password);
      debug.logger.info(`UserService: O ${username} pode fazer o login!`);
      debug.logger.info(`UserService: iniciando processo de geração de token`);

      const token = await AuthMiddleware.generateToken(user);
      debug.logger.info(`UserService: ${token} gerado para ${user}`);
      return { user, token };
    } catch (error) {
      debug.logger.warn(`UserService: ocorreu um erro no login na camada de serviço`);
      if (error.status === 401) {
        throw { status: 401, message: error.message };
      }
      throw error;
    }
  }
}
export default UserService;
