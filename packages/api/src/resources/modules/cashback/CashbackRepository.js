import debug from '../../../debug/index.js';
import AppError from '../../../errors/AppError.js';

class CashbackRepository {
  constructor(model) {
    this.model = model;
  }

  async createCashback(cashbackData) {
    try {
      debug.logger.info(`CashbackRepository: delegando para camada de modelo`);
      const createdCashback = await this.model.createCashback(cashbackData);
      return createdCashback;
    } catch (error) {
      debug.logger.error('CashbackRepository: Erro ao delegar para camada de modelo', error);
      throw new AppError(500, 'Erro ao delegar para camada de modelo');
    }
  }

  async activateCashback(cashbackId) {
    try {
      debug.logger.info('CashbackRepository: ativando cashback');
      const activatedCashback = await this.model.activateCashback(cashbackId);
      return activatedCashback;
    } catch (error) {
      debug.logger.error('CashbackRepository: Erro ao ativar cashback', { cashbackId, error });
      throw new AppError(500, 'Erro no repositório ao ativar cashback');
    }
  }

  async findActiveCashback() {
    try {
      const activeCashback = await this.model.findActiveCashback();
      return activeCashback;
    } catch (error) {
      debug.logger.error('CashbackRepository: Erro ao buscar cashback ativo', error);
      throw new AppError(500, 'Erro no repositório ao buscar cashback ativo');
    }
  }

  async findAllCashbacks() {
    try {
      debug.logger.info('CashbackRepository: buscando todos os cashbacks');
      return await this.model.findAllWithTiers();
    } catch (error) {
      debug.logger.error('CashbackRepository: Erro ao buscar cashbacks', error);
      throw new AppError(500, 'Erro ao buscar cashbacks no repositório');
    }
  }

  async updateCashback(cashbackId, cashbackData) {
    try {
      debug.logger.info('CashbackRepository: Atualizando dados do cashback', { cashbackId });
      const updatedCashback = await this.model.updateCashbackById(cashbackId, cashbackData);

      if (!updatedCashback) {
        throw new AppError(404, 'Cashback não encontrado');
      }

      return updatedCashback;
    } catch (error) {
      debug.logger.error('CashbackRepository: Erro ao atualizar cashback', { cashbackId, error });
      throw new AppError(500, 'Erro ao atualizar cashback no repositório');
    }
  }
}

export default CashbackRepository;
