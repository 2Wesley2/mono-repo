import Controller from '../../core/Controller.js';
import debug from '../../../debug/index.js';
import { CUSTOMER } from '../../constants/index.js';
import AuthMiddleware from '../../../middlewares/authMiddleware.js';
import AuthorizationMiddleware from '../../../middlewares/authorizationMiddleware.js';

class CustomerController extends Controller {
  constructor(service) {
    super(service, CUSTOMER);
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {
    this.router.get('/:cpf', this.findByCPF.bind(this));
    this.router.post(
      '/',
      AuthMiddleware.authenticate,
      AuthorizationMiddleware.authorize(['admin']),
      this.create.bind(this),
    );
  }

  async findByCPF(req, res, next) {
    try {
      const { cpf } = req.params;
      const customer = await this.service.findByCPF(cpf);
      debug.logger.info('Controlador: Cliente encontrado', { cpf });
      res.status(200).json(customer);
    } catch (error) {
      debug.logger.error('Controlador: Erro ao buscar cliente', { cpf, error });
      next(error);
    }
  }
}

export default CustomerController;
