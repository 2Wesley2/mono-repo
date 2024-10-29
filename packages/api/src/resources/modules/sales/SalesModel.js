import Model from '../../core/Model.js';
import debug from '../../../debug/index.js';
import { SALES } from '../../constants/index.js';

const salesSchema = {
  clientCPF: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  ticketApplied: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
};

class SalesModel extends Model {
  constructor() {
    super(salesSchema, SALES);
  }

  async create(data) {
    try {
      const sale = await this.model.create(data);
      debug.logger.info('Venda criada com sucesso', { data: sale });
      return sale;
    } catch (error) {
      debug.logger.error('Erro ao criar venda', { data, error });
      throw error;
    }
  }

  async findById(id) {
    try {
      const sale = await this.model.findById(id);
      if (!sale) {
        debug.logger.warn(`Venda com ID ${id} não encontrada`);
      } else {
        debug.logger.info(`Venda com ID ${id} encontrada`, { sale });
      }
      return sale;
    } catch (error) {
      debug.logger.error('Erro ao buscar venda por ID', { id, error });
      throw error;
    }
  }

  async find(filters = {}, options = {}) {
    try {
      const sales = await this.model.find(filters, null, options);
      debug.logger.info('Busca de vendas concluída', { filters, options, count: sales.length });
      return sales;
    } catch (error) {
      debug.logger.error('Erro ao buscar vendas', { filters, options, error });
      throw error;
    }
  }

  async findByIdAndUpdate(id, data, options = { new: true, runValidators: true }) {
    try {
      const updatedSale = await this.model.findByIdAndUpdate(id, data, options);
      if (!updatedSale) {
        debug.logger.warn(`Venda com ID ${id} não encontrada para atualização`);
      } else {
        debug.logger.info(`Venda com ID ${id} atualizada com sucesso`, { updatedSale });
      }
      return updatedSale;
    } catch (error) {
      debug.logger.error('Erro ao atualizar venda', { id, data, error });
      throw error;
    }
  }

  async findByIdAndDelete(id) {
    try {
      const deletedSale = await this.model.findByIdAndDelete(id);
      if (!deletedSale) {
        debug.logger.warn(`Venda com ID ${id} não encontrada para exclusão`);
      } else {
        debug.logger.info(`Venda com ID ${id} excluída com sucesso`, { deletedSale });
      }
      return deletedSale;
    } catch (error) {
      debug.logger.error('Erro ao excluir venda', { id, error });
      throw error;
    }
  }
}

export default SalesModel;
