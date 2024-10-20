import Controller from '../../core/Controller.js';
import { USER } from '../../constants/index.js';

class UserController extends Controller {
  constructor(service) {
    super(service, USER);
    this.initializeCustomRoutes();
  }
  initializeCustomRoutes() {
    this.router.post('/register', this.register.bind(this));
    this.router.post('/login', this.login.bind(this));
    this.router.use(service.authenticate);
    this.router.get('/admin', service.authorize(['admin']), this.adminOnly.bind(this));
  }
}

export default UserController;
