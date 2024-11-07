import debug from '../../../debug/index.js';
import AppError from '../../../errors/AppError.js';

class TierRepository {
  constructor(model) {
    this.model = model;
  }

  async create(tiersData) {
    try {
      const createdTiers = await this.model.create(tiersData);
      debug.logger.info('TierRepository: Delegando o TierData');
      return createdTiers;
    } catch (error) {
      debug.logger.error('TierRepository: Erro ao delegar', error);
      throw new AppError(500, 'Erro no repositório ao criar documentos de tiers');
    }
  }

  async findTiersByCashbackId(cashbackId) {
    debug.logger.info('Buscando tiers para o cashback', { cashbackId });

    try {
      const tiers = await this.model.findTiersByCashbackId(cashbackId);

      if (!tiers || tiers.length === 0) {
        debug.logger.warn('Nenhum tier encontrado para o cashback', { cashbackId });
        throw new AppError(404, 'Nenhuma faixa de desconto disponível para este cashback');
      }

      return tiers;
    } catch (error) {
      debug.logger.error('Erro no repositório ao buscar tiers para o cashback', { cashbackId, error });
      throw new AppError(500, 'Erro no repositório ao buscar faixas de desconto');
    }
  }
}

export default TierRepository;
