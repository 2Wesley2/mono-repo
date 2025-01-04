import Controller from '../../components/Controller.js';
import AuthMiddleware from '../../../middlewares/authMiddlewares.js';
import debug from '../../../debug/index.js';
class UserController extends Controller {
  constructor(service, authenticationService, authorizationService) {
    super();
    this.initializeCustomRoutes();
    this.service = service;
    this.authenticationService = authenticationService;
    this.authorizationService = authorizationService;
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
      const isToken = req.cookies?.token;
      const isAuthenticated = await this.authenticationService.isAuthenticate(isToken);
      if (isToken && isAuthenticated) {
        res.json('Usuário já está autênticado');
      }
      const { username, password } = req.body;
      const authUser = await this.authenticationService.authenticate(password, passwordHashed);
      if (!authUser) {
        throw Error('usuário ou senha inválidos');
      }
      const token = await this.authenticationService.generateToken(payload);
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
