import Controller from '../../../../core/infrastructure/database/components/base/Controller.js';
import { UnauthorizedError } from '../../../../errors/Exceptions.js';

class UserController extends Controller {
  constructor(service) {
    super();
    this.initializeCustomRoutes();
    this.service = service;
  }

  initializeCustomRoutes() {
    this.router.post('/login', this.middlewares.blockIfAuthenticated, this.login.bind(this));
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
      const { password, username } = req.body;
      const credentials = { username, password };
      const token = await this.service.login({ ...credentials });
      if (!token) {
        throw new UnauthorizedError();
      }
      res.cookie('wfSystem', token, {
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
      res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
