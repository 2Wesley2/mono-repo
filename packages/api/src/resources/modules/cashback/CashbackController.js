import Controller from '../../core/Controller.js';
import debug from '../../../debug/index.js';
import AppError from '../../../errors/AppError.js';

class CashbackController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {
    this.router.post('/create', this.create.bind(this));
    this.router.post('/:id/activate', this.activateCashback.bind(this));
    this.router.get('/active', this.getActiveCashback.bind(this));
    this.router.get('/cashbacks', this.listAllCashbacks.bind(this));
  }

  async create(req, res, next) {
    try {
      const { name, tiers } = req.body;
      const newCashback = await this.service.createCashbackWithTiers({ name, tiers });
      debug.logger.info('CashbackController: Cashback e tiers criados com sucesso', { name });
      res.status(201).json(newCashback);
    } catch (error) {
      debug.logger.error('CashbackController: Erro ao criar cashback', { error });
      next(error);
    }
  }

  async activateCashback(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID é obrigatório para ativar o cashback' });
      }

      const activatedCashback = await this.service.activateCashback(id);
      debug.logger.info('CashbackController: Cashback ativado com sucesso', { id });
      res.status(200).json(activatedCashback);
    } catch (error) {
      debug.logger.error('CashbackController: Erro ao ativar cashback', { id, error });
      next(error);
    }
  }

  async getActiveCashback(req, res, next) {
    try {
      const activeCashback = await this.service.findActiveCashback();
      if (!activeCashback) {
        return res.status(404).json({ message: 'Nenhum cashback ativo disponível' });
      }

      debug.logger.info('CashbackController: Cashback ativo encontrado');
      res.status(200).json(activeCashback);
    } catch (error) {
      debug.logger.error('CashbackController: Erro ao buscar cashback ativo', { error });
      next(error);
    }
  }

  async listAllCashbacks(req, res, next) {
    try {
      const cashbacks = await this.service.listAllCashbacks();
      res.status(200).json(cashbacks);
    } catch (error) {
      debug.logger.error('CashbackController: Erro ao listar cashbacks', { error });
      next(error);
    }
  }
}

export default CashbackController;
