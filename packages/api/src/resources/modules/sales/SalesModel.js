import Model from '../../core/Model.js';
import debug from '../../../debug/index.js';
import { SALES, TICKET, EMPLOYEE } from '../../constants/index.js';
import Database from '../../../database/index.js';

const salesSchema = {
  clientCPF: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  ticketApplied: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
  appliedVoucher: {
    type: Database.ObjectId,
    ref: TICKET,
  },
  employee: {
    type: Database.ObjectId,
    ref: EMPLOYEE,
  },
};

class SalesModel extends Model {
  constructor() {
    super(salesSchema, SALES);
  }

  async createSale(data) {
    try {
      const sale = await this.model.create(data);
      debug.logger.info('Venda criada com sucesso', { data: sale });
      return sale;
    } catch (error) {
      debug.logger.error('Erro ao criar venda', { data, error });
      throw error;
    }
  }

  async findByIdSales(id) {
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

  async findSales(filters = {}, options = {}) {
    try {
      const sales = await this.model.find(filters, null, options);
      debug.logger.info('Busca de vendas concluída', { filters, options, count: sales.length });
      return sales;
    } catch (error) {
      debug.logger.error('Erro ao buscar vendas', { filters, options, error });
      throw error;
    }
  }

  async findByIdAndUpdateSales(id, data, options = { new: true, runValidators: true }) {
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

  async findByIdAndDeleteSales(id) {
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
  async updateAppliedVoucher(saleId, voucherId) {
    return this.findByIdAndUpdate(saleId, { appliedVoucher: voucherId });
  }

  async updateEmployee(saleId, employeeId) {
    return this.findByIdAndUpdate(saleId, { employee: employeeId });
  }
}

export default SalesModel;
