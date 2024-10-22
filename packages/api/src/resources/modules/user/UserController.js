import Controller from '../../core/Controller.js';
import { USER } from '../../constants/index.js';
import AuthMiddleware from '../../../middlewares/authMiddleware.js';
import debug from '../../../debug/index.js';

class UserController extends Controller {
  constructor(service) {
    super(service, USER);
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {
    this.router.post('/login', AuthMiddleware.blockIfAuthenticated.bind(AuthMiddleware), this.login.bind(this));
    this.router.post('/logout', this.logout.bind(this));
    this.router.post('/register', this.create.bind(this));
  }

  async create(req, res, next) {
    try {
      const { username, password, role } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username e password são obrigatórios' });
      }

      debug.logger.info('UserController.js: criando usuário');
      const user = await this.service.create({ username, password, role });
      debug.logger.info(`UserController.js: Usuário ${username} criado`);
      res.status(201).json(user);
    } catch (error) {
      debug.logger.error(`UserController.js: Erro ao criar usuário: ${error.message}`);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      debug.logger.info(`UserController: Iniciando login para ${username}`);

      const { user, token } = await this.service.login(username, password);

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 3600000,
      });

      debug.logger.info(`UserController: Login realizado com sucesso para ${username}`);
      res.status(200).json({ user });
    } catch (error) {
      debug.logger.error(`UserController: Erro ao logar ${req.body.username}. Erro: ${error.message}`);
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      AuthMiddleware.logout(req, res);
      debug.logger.info('UserController.js: logout realizado com sucesso');
      res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      debug.logger.error('UserController.js: erro ao realizar logout');
      next(error);
    }
  }
}

export default UserController;
