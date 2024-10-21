import debug from '../../debug/index.js';

class Repository {
  constructor(model, documentName) {
    this.model = model;
    this.documentName = documentName;
  }

  async create(data) {
    try {
      const result = await this.model.create(data);
      debug.logger.info(`Repository.js: ${this.documentName} criado`, { data: result });
      return result;
    } catch (error) {
      debug.logger.error(`Repository.js: Erro ao criar ${this.documentName}`, { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      const document = await this.model.findById(id);
      debug.logger.info(`Repository.js: ${this.documentName} encontrado`, { id });
      return document;
    } catch (error) {
      debug.logger.error(`Repository.js: Erro ao buscar ${this.documentName} por ID`, { id, error });
      throw error;
    }
  }

  async update(id, data) {
    try {
      const result = await this.model.update(id, data);
      debug.logger.info(`Repository.js: ${this.documentName} atualizado`, { id, data: result });
      return result;
    } catch (error) {
      debug.logger.error(`Repository.js: Erro ao atualizar ${this.documentName}`, { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.model.delete(id);
      debug.logger.info(`Repository.js: ${this.documentName} deletado`, { id });
      return true;
    } catch (error) {
      debug.logger.error(`Repository.js: Erro ao deletar ${this.documentName}`, { id, error });
      throw error;
    }
  }
}

export default Repository;
