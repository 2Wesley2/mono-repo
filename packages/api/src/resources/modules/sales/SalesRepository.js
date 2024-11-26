import debug from '../../../debug/index.js';

class SalesRepository {
  constructor(model) {
    this.model = model;
  }

  async createSale(data) {
    try {
      const sale = await this.model.createSale(data);
      debug.logger.info('Repositório: Venda criada com sucesso', { data: sale });
      return sale;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao criar venda', { data, error });
      throw error;
    }
  }

  async findByIdSales(id) {
    try {
      const sale = await this.model.findByIdSales(id);
      if (!sale) {
        debug.logger.warn(`Repositório: Venda com ID ${id} não encontrada`);
      } else {
        debug.logger.info(`Repositório: Venda com ID ${id} encontrada`, { sale });
      }
      return sale;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao buscar venda por ID', { id, error });
      throw error;
    }
  }

  async findAll(filters = {}, options = {}) {
    try {
      const sales = await this.model.findSales(filters, null, options);
      debug.logger.info('Repositório: Vendas encontradas', { filters, options, count: sales.length });
      return sales;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao buscar vendas', { filters, options, error });
      throw error;
    }
  }

  async updateSale(id, data) {
    try {
      const updatedSale = await this.model.findByIdAndUpdateSales(id, data, {
        new: true,
        runValidators: true,
      });
      if (!updatedSale) {
        debug.logger.warn(`Repositório: Venda com ID ${id} não encontrada para atualização`);
      } else {
        debug.logger.info(`Repositório: Venda com ID ${id} atualizada com sucesso`, { updatedSale });
      }
      return updatedSale;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao atualizar venda', { id, data, error });
      throw error;
    }
  }
}

export default SalesRepository;
