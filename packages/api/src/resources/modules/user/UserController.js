import Controller from '../../core/Controller.js';
import AuthMiddleware from '../../../middlewares/authMiddleware.js';
import debug from '../../../debug/index.js';
class UserController extends Controller {
  constructor(service) {
    super();
    this.initializeCustomRoutes();
    this.service = service;
  }

  initializeCustomRoutes() {
    this.router.post('/login', AuthMiddleware.blockIfAuthenticated.bind(AuthMiddleware), this.login.bind(this));
    this.router.post('/logout', this.logout.bind(this));
    this.router.post('/register', this.createUser.bind(this));
  }

  async createUser(req, res, next) {
    try {
      const { username, password, role } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username e password são obrigatórios' });
      }

      const user = await this.service.createUser({ username, password, role });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      debug.logger.info('UserController: iniciando método de login na camada de UserController.');
      debug.logger.info('UserController: extraindo username e password do body da requisição');
      const { username, password } = req.body;
      debug.logger.info(`UserController: ${username} e ${password} extraídos do body`);
      debug.logger.info(
        `UserController: delegando login para camada de service passando o username e password extraídos do body`,
      );
      const { user, token } = await this.service.login(username, password);
      debug.logger.info(`UserController: ${user} e ${token} obtidos da camada de serviço`);
      debug.logger.info(`UserController: passando o token para o cookie na resposta ao usuário`);

      res.cookie('wfSystem', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 3600000,
      });
      debug.logger.info(`UserController: cookie enviado`);
      res.status(200).json({ id: user._id, username: user.username });
      debug.logger.info(`UserController: finalizado`);
    } catch (error) {
      debug.logger.warn(`UserController: problema de login na camada de controller`);
      if (error.status === 401) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos' });
      }
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      AuthMiddleware.logout(req, res);
      res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
