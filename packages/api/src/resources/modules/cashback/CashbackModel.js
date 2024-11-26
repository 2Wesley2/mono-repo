import Model from '../../core/Model.js';
import debug from '../../../debug/index.js';
import { TIER, CASHBACK, TICKET } from '../../constants/index.js';
import Database from '../../../database/index.js';
import AppError from '../../../errors/AppError.js';

const CashbackSchema = {
  name: { type: String },
  ticketsId: [{ type: Database.ObjectId, ref: TICKET }],
  ruleDiscont: [{ type: Database.ObjectId, ref: TIER }],
  isActive: { type: Boolean, default: false },
};

class CashbackModel extends Model {
  constructor() {
    debug.logger.info('CashbackModel instanciada');
    super(CashbackSchema, CASHBACK);
  }

  async createCashback(cashbackData) {
    try {
      debug.logger.info(`CashbackModel: criando o modelo de cashback com o cashbackData: ${cashbackData}`);
      const createdCashback = await this.model.create(cashbackData);
      debug.logger.info(`CashbackModel: createdCashback: ${createdCashback}`);
      return createdCashback;
    } catch (error) {
      debug.logger.error(`CashbackModel: Erro ao criar documento de cashback com ${cashbackData}`, error);
      throw new AppError(500, 'Erro ao criar documento de cashback');
    }
  }
  async activateCashback(cashbackId) {
    try {
      debug.logger.info('Desativando todos os cashbacks ativos');
      await this.model.updateMany({ isActive: { $ne: false } }, { isActive: false });
      debug.logger.info('Todos os cashbacks foram desativados');
      const activatedCashback = await this.model.findOneAndUpdate(
        { _id: cashbackId },
        { isActive: true },
        { new: true },
      );

      if (!activatedCashback) {
        debug.logger.error('Erro ao ativar cashback: cashback não encontrado', { cashbackId });
        throw new AppError(404, 'Cashback não encontrado');
      }

      debug.logger.info('Cashback ativado com sucesso', { cashbackId });
      return activatedCashback;
    } catch (error) {
      debug.logger.error('Erro ao ativar cashback:', error);
      throw new AppError(500, 'Erro interno ao ativar cashback');
    }
  }

  async findActiveCashback() {
    try {
      debug.logger.info('Buscando cashback ativo com tiers associados');
      const activeCashback = await this.model.findOne({ isActive: true }).populate('ruleDiscont');

      if (!activeCashback) {
        debug.logger.warn('Nenhum cashback ativo encontrado');
        throw new AppError(404, 'Nenhum cashback ativo disponível');
      }

      debug.logger.info(`Cashback ativo encontrado: ${JSON.stringify(activeCashback)}`);
      return activeCashback;
    } catch (error) {
      debug.logger.error('Erro ao buscar cashback ativo:', error);
      throw new AppError(500, 'Erro interno ao buscar cashback ativo');
    }
  }

  async findAllWithTiers() {
    try {
      debug.logger.info('CashbackModel: buscando todos os cashbacks com tiers');
      const cashbacks = await this.model.find().populate('ruleDiscont');
      return cashbacks;
    } catch (error) {
      debug.logger.error('Erro ao buscar todos os cashbacks com tiers:', error);
      throw new AppError(500, 'Erro ao buscar cashbacks');
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

  async updateCashbackById(cashbackId, cashbackData) {
    try {
      debug.logger.info(`CashbackModel: Atualizando o cashback com ID: ${cashbackId}`);
      const updatedCashback = await this.model.findOneAndUpdate(
        { _id: cashbackId },
        { $set: cashbackData },
        { new: true },
      );

      if (!updatedCashback) {
        throw new AppError(404, 'Cashback não encontrado');
      }

      debug.logger.info(`CashbackModel: Cashback atualizado com sucesso: ${JSON.stringify(updatedCashback)}`);
      return updatedCashback;
    } catch (error) {
      debug.logger.error('Erro ao atualizar cashback no banco de dados', error);
      throw new AppError(500, 'Erro ao atualizar cashback no banco de dados');
    }
  }
}
export default CashbackModel;
