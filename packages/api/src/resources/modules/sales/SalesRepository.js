import config from '../../../config/index.js';

class SalesRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const result = await this.model.create(data);
      config.logger.info('Repositório: Venda criada', { data: result });
      return result;
    } catch (error) {
      config.logger.error('Repositório: Erro ao criar venda', { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      const sale = await this.model.findById(id);
      config.logger.info('Repositório: Venda encontrada', { id });
      return sale;
    } catch (error) {
      config.logger.error('Repositório: Erro ao buscar venda por ID', { id, error });
      throw error;
    }
  }

  async update(id, data) {
    try {
      const result = await this.model.update(id, data);
      config.logger.info('Repositório: Venda atualizada', { id, data: result });
      return result;
    } catch (error) {
      config.logger.error('Repositório: Erro ao atualizar venda', { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.model.delete(id);
      config.logger.info('Repositório: Venda deletada', { id });
      return true;
    } catch (error) {
      config.logger.error('Repositório: Erro ao deletar venda', { id, error });
      throw error;
    }
  }
}

export default SalesRepository;
