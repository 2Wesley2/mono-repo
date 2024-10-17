import Database from '../../../database/index.js';
import config from '../../../config/index.js';

const salesSchema = {
  clientCPF: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  ticketApplied: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
};

const SalesSchema = Database.registerModel({
  schema: salesSchema,
  modelName: 'Sales',
});

class SalesModel {
  constructor() {
    this.model = SalesSchema;
  }

  async create(data) {
    try {
      const newSale = this.model(data);
      const result = await newSale.save();
      config.logger.info('Venda registrada com sucesso', { data: result });
      return result;
    } catch (error) {
      config.logger.error('Erro ao registrar venda', { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      if (!Database.isValidObjectId(id)) {
        throw new Error('ID inválido');
      }
      const sale = await this.model.findById(id);
      if (sale) {
        config.logger.info('Venda encontrada', { id });
      } else {
        config.logger.warn('Venda não encontrada', { id });
      }
      return sale;
    } catch (error) {
      config.logger.error('Erro ao buscar venda por ID', { id, error });
      throw error;
    }
  }

  async update(id, data) {
    try {
      if (!Database.isValidObjectId(id)) {
        throw new Error('ID inválido');
      }
      const updatedSale = await this.model.findByIdAndUpdate(id, data, { new: true });
      config.logger.info('Venda atualizada', { id, data: updatedSale });
      return updatedSale;
    } catch (error) {
      config.logger.error('Erro ao atualizar venda', { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!Database.isValidObjectId(id)) {
        throw new Error('ID inválido');
      }
      await this.model.findByIdAndDelete(id);
      config.logger.info('Venda deletada', { id });
      return true;
    } catch (error) {
      config.logger.error('Erro ao deletar venda', { id, error });
      throw error;
    }
  }
}

export default SalesModel;
