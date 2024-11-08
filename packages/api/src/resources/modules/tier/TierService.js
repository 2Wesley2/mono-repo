import debug from '../../../debug/index.js';
import AppError from '../../../errors/AppError.js';

class TierService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(tiersData) {
    try {
      debug.logger.info('TierService: Delegando tierData para o Repository');
      const createdTiers = await this.repository.create(tiersData);
      return createdTiers;
    } catch (error) {
      debug.logger.error('TierService: Erro ao delegar para repository', error);
      throw new AppError(500, 'Erro no serviço ao criar documentos de tiers');
    }
  }
  async findTiersByCashbackId(cashbackId) {
    try {
      return await this.repository.findTiersByCashbackId(cashbackId);
    } catch (error) {
      debug.logger.error('Erro no serviço ao buscar tiers para o cashback', { cashbackId, error });
      throw new AppError(500, 'Erro no serviço ao buscar faixas de desconto');
    }
  }

  async updateTiersByCashbackId(cashbackId, tiersData) {
    try {
      debug.logger.info('TierService: Atualizando faixas de desconto para o cashback');
      return await this.repository.updateTiersByCashbackId(cashbackId, tiersData);
    } catch (error) {
      debug.logger.error('Erro no serviço ao atualizar faixas de desconto', { cashbackId, error });
      throw new AppError(500, 'Erro ao atualizar faixas de desconto');
    }
  }
}

export default TierService;
