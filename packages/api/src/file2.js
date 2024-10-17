import config from './config/index';

class CamadaRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const result = await this.model.create(data);
      config.logger.info('Repositório: Documento criado', { data: result });
      return result;
    } catch (error) {
      config.logger.error('Repositório: Erro ao criar documento', { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      const document = await this.model.findById(id);
      config.logger.info('Repositório: Documento encontrado', { id });
      return document;
    } catch (error) {
      config.logger.error('Repositório: Erro ao buscar documento por ID', { id, error });
      throw error;
    }
  }

  async update(id, data) {
    try {
      const result = await this.model.update(id, data);
      config.logger.info('Repositório: Documento atualizado', { id, data: result });
      return result;
    } catch (error) {
      config.logger.error('Repositório: Erro ao atualizar documento', { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.model.delete(id);
      config.logger.info('Repositório: Documento deletado', { id });
      return true;
    } catch (error) {
      config.logger.error('Repositório: Erro ao deletar documento', { id, error });
      throw error;
    }
  }
}

export default CamadaRepository;
