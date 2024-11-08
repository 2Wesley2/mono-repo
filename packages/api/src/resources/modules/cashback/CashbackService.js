import debug from '../../../debug/index.js';
import AppError from '../../../errors/AppError.js';

class CashbackService {
  constructor(repository, tierService) {
    this.repository = repository;
    this.tierService = tierService;
  }

  _validateCashbackData({ name, tiers }) {
    if (!name || typeof name !== 'string') {
      throw new AppError(400, 'O campo "name" é obrigatório e deve ser uma string');
    }
    if (!Array.isArray(tiers) || tiers.length === 0) {
      throw new AppError(400, 'O campo "tiers" deve ser uma lista de objetos');
    }
  }

  _formatTierData(tiers, cashbackId) {
    return tiers.map((tier, index) => {
      const { discountType, minPurchaseAmount, maxPurchaseAmount, discountPercentage, discountFixedValue } = tier;

      if (!discountType || !['percentage', 'fixed'].includes(discountType)) {
        throw new AppError(
          400,
          `O campo "discountType" na tier ${index + 1} é obrigatório e deve ser 'percentage' ou 'fixed'`,
        );
      }

      if (minPurchaseAmount == null || typeof minPurchaseAmount !== 'number' || minPurchaseAmount <= 0) {
        throw new AppError(
          400,
          `O campo "minPurchaseAmount" na tier ${index + 1} é obrigatório e deve ser um número positivo`,
        );
      }

      if (
        maxPurchaseAmount == null ||
        typeof maxPurchaseAmount !== 'number' ||
        maxPurchaseAmount <= minPurchaseAmount
      ) {
        throw new AppError(
          400,
          `O campo "maxPurchaseAmount" na tier ${index + 1} é obrigatório e deve ser maior que minPurchaseAmount`,
        );
      }

      if (discountType === 'percentage') {
        if (discountPercentage == null || typeof discountPercentage !== 'number' || discountPercentage < 0) {
          throw new AppError(
            400,
            `O campo "discountPercentage" na tier ${index + 1} é obrigatório para "percentage" e deve ser positivo`,
          );
        }
        return {
          cashbackId,
          discountType,
          minPurchaseAmount,
          maxPurchaseAmount,
          discountPercentage,
        };
      } else if (discountType === 'fixed') {
        if (discountFixedValue == null || typeof discountFixedValue !== 'number' || discountFixedValue < 0) {
          throw new AppError(
            400,
            `O campo "discountFixedValue" na tier ${index + 1} é obrigatório para "fixed" e deve ser positivo`,
          );
        }
        return {
          cashbackId,
          discountType,
          minPurchaseAmount,
          maxPurchaseAmount,
          discountFixedValue,
        };
      }
    });
  }

  async createCashbackWithTiers({ name, tiers }) {
    try {
      this._validateCashbackData({ name, tiers });
      const cashbackData = { name };
      const createdCashback = await this.repository.create(cashbackData);
      const cashbackId = createdCashback._id;

      const formattedTiers = this._formatTierData(tiers, cashbackId);
      debug.logger.info(`CashbackService: tiers formatados ${JSON.stringify(formattedTiers)}`);

      const createdTiers = await this.tierService.create(formattedTiers);
      debug.logger.info(`CashbackService: tiers criados ${createdTiers}`);

      const ruleDiscontIds = createdTiers.map((tier) => tier._id);
      createdCashback.ruleDiscont = ruleDiscontIds;
      await createdCashback.save();

      debug.logger.info(`CashbackService: cashback atualizado com os ids dos tiers: ${ruleDiscontIds}`);

      return { ...createdCashback.toObject(), tiers: createdTiers };
    } catch (error) {
      debug.logger.error('CashbackService: Erro ao criar cashback com tiers', error);
      throw new AppError(500, 'Erro ao criar cashback com tiers');
    }
  }

  async activateCashback(cashbackId) {
    try {
      debug.logger.info('CashbackService: ativando cashback');
      const activatedCashback = await this.repository.activateCashback(cashbackId);
      debug.logger.info('CashbackService: cashback ativado com sucesso');
      return activatedCashback;
    } catch (error) {
      debug.logger.error('CashbackService: Erro ao ativar cashback', { cashbackId, error });
      throw new AppError(500, 'Erro no serviço ao ativar cashback');
    }
  }

  async findActiveCashback() {
    try {
      const activeCashback = await this.repository.findActiveCashback();
      return activeCashback;
    } catch (error) {
      debug.logger.error('CashbackService: Erro ao buscar cashback ativo', error);
      throw new AppError(500, 'Erro no serviço ao buscar cashback ativo');
    }
  }
  async listAllCashbacks() {
    try {
      debug.logger.info('CashbackService: listando todos os cashbacks');
      return await this.repository.findAllCashbacks();
    } catch (error) {
      debug.logger.error('CashbackService: Erro ao listar cashbacks', error);
      throw new AppError(500, 'Erro ao listar cashbacks');
    }
  }
  async updateCashbackAndTiers(cashbackId, { name, tiers }) {
    try {
      debug.logger.info('CashbackService: Atualizando cashback e tiers associados');

      if (name) {
        if (typeof name !== 'string') {
          throw new AppError(400, 'O campo "name" deve ser uma string');
        }
      }

      const formattedTiers = this._formatTierData(tiers, cashbackId);
      debug.logger.info(`CashbackService: tiers formatados para atualização ${JSON.stringify(formattedTiers)}`);

      if (formattedTiers && formattedTiers.length > 0) {
        await this.tierService.updateTiersByCashbackId(cashbackId, formattedTiers);
      }
      const updatedCashback = await this.repository.updateCashback(cashbackId, { name });
      debug.logger.info('CashbackService: Cashback atualizado com sucesso');

      return updatedCashback;
    } catch (error) {
      debug.logger.error('CashbackService: Erro ao atualizar cashback e tiers', { cashbackId, error });
      throw new AppError(500, 'Erro ao atualizar cashback e tiers');
    }
  }
}

export default CashbackService;
