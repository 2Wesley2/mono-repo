import Controller from '../../components/Controller.js';
import { UnauthorizedError } from '../../../errors/Exceptions.js';

class UserController extends Controller {
  constructor(service) {
    super();
    this.initializeCustomRoutes();
    this.service = service;
  }

  initializeCustomRoutes() {
    this.router.post('/login', this.login.bind(this));
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
      console.log(`inicio da depuração`);
      const { password, username } = req.body;
      const user = await this.service.getUserByUsername(username);
      if (!user) {
        throw new UnauthorizedError();
      }
      const authService = this.middlewares;
      console.log(`serviço de autenticação\n  ${authService}\ntipo:\n ${typeof authService}`);
      const payload = { id: user._id, role: user.role };
      console.log(
        `payload montado:\n  ${payload}\n tipos:\n payload: ${typeof payload}\n payload.id: ${typeof payload.id}\n payload.role: ${payload.role}`,
      );
      const credentials = { password: password, userPasswordHashed: user.password, payload: payload };
      console.log(
        `credenciais montada:\n  ${credentials}\n tipos:\n credentials: ${typeof credentials}\n credentials.password: ${typeof credentials.password}\n credentials.userPasswordHashed: ${credentials.userPasswordHashed}\n`,
      );
      const auth = await authService.authenticate({ ...credentials });
      console.log(`resultado de da autenticação:\n  ${auth}\ntipo:\n ${typeof auth}`);

      if (!auth) {
        throw new UnauthorizedError();
      }
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
      res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
