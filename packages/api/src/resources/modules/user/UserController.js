import Controller from '../../core/Controller.js';
import { USER } from '../../constants/index.js';
import AuthMiddleware from '../../../middlewares/authMiddleware.js';

class UserController extends Controller {
  constructor(service) {
    super(service, USER);
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {
    this.router.post('/login', AuthMiddleware.blockIfAuthenticated.bind(AuthMiddleware), this.login.bind(this));
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const { user, token } = await this.service.login(username, password);
      res.status(200).json({ user, token });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
