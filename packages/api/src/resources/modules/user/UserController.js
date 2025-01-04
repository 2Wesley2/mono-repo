import Controller from '../../components/Controller.js';
import AuthMiddleware from '../../../middlewares/authMiddlewares.js';
import { UnauthorizedError } from '../../../errors/Exceptions.js';

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
    const { password, username } = req;
    const user = await this.service.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedError();
    }
    const authService = super.middlewares;
    const payload = { user: user.username, role: user.role };
    const credentials = { password: password, userPasswordHashed: user.password, payload: payload };
    const auth = await authService.authenticate({ ...credentials });
    if (!auth) {
      throw new UnauthorizedError();
    }
    try {
      res.cookie('wfSystem', auth, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 3600000,
      });
      res.status(200).json({ id: user._id, username: user.username });
    } catch (error) {
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
