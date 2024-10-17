import config from '../../config/index.js';

class Service {
  constructor(repository) {
    this.repository = repository;
  }
  async create(data) {
    try {
      const result = await this.repository.create(data);
      config.logger.info('Serviço: Documento criado com sucesso', { data: result });
      return result;
    } catch (error) {
      config.logger.error('Serviço: Erro ao criar documento', { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      const document = await this.repository.findById(id);
      config.logger.info('Serviço: Documento encontrado', { id });
      return document;
    } catch (error) {
      config.logger.error('Serviço: Erro ao buscar documento por ID', { id, error });
      throw error;
    }
  }

  async update(id, data) {
    try {
      const result = await this.repository.update(id, data);
      config.logger.info('Serviço: Documento atualizado', { id, data: result });
      return result;
    } catch (error) {
      config.logger.error('Serviço: Erro ao atualizar documento', { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.repository.delete(id);
      config.logger.info('Serviço: Documento deletado', { id });
      return true;
    } catch (error) {
      config.logger.error('Serviço: Erro ao deletar documento', { id, error });
      throw error;
    }
  }
}

export default Service;
