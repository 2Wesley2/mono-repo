import config from '../../config/index.js';

class Repository {
  constructor(model, documentName) {
    this.model = model;
    this.documentName = documentName;
  }

  async create(data) {
    try {
      const result = await this.model.create(data);
      config.logger.info(`Repositório: ${this.documentName} criado`, { data: result });
      return result;
    } catch (error) {
      config.logger.error(`Repositório: Erro ao criar ${this.documentName}`, { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      const document = await this.model.findById(id);
      config.logger.info(`Repositório: ${this.documentName} encontrado`, { id });
      return document;
    } catch (error) {
      config.logger.error(`Repositório: Erro ao buscar ${this.documentName} por ID`, { id, error });
      throw error;
    }
  }

  async update(id, data) {
    try {
      const result = await this.model.update(id, data);
      config.logger.info(`Repositório: ${this.documentName} atualizado`, { id, data: result });
      return result;
    } catch (error) {
      config.logger.error(`Repositório: Erro ao atualizar ${this.documentName}`, { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.model.delete(id);
      config.logger.info(`Repositório: ${this.documentName} deletado`, { id });
      return true;
    } catch (error) {
      config.logger.error(`Repositório: Erro ao deletar ${this.documentName}`, { id, error });
      throw error;
    }
  }
}

export default Repository;
