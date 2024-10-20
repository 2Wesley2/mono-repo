import debug from '../../config/index.js';

class Service {
  constructor(repository, documentName) {
    this.repository = repository;
    this.documentName = documentName;
  }
  async create(data) {
    try {
      const result = await this.repository.create(data);
      debug.logger.info(`Serviço: ${this.documentName} criado com sucesso`, { data: result });
      return result;
    } catch (error) {
      debug.logger.error(`Serviço: Erro ao criar ${this.documentName}`, { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      const document = await this.repository.findById(id);
      debug.logger.info(`Serviço: ${this.documentName} encontrado`, { id });
      return document;
    } catch (error) {
      debug.logger.error(`Serviço: Erro ao buscar ${this.documentName} por ID`, { id, error });
      throw error;
    }
  }

  async update(id, data) {
    try {
      const result = await this.repository.update(id, data);
      debug.logger.info(`Serviço: ${this.documentName} atualizado`, { id, data: result });
      return result;
    } catch (error) {
      debug.logger.error(`Serviço: Erro ao atualizar ${this.documentName}`, { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.repository.delete(id);
      debug.logger.info(`Serviço: ${this.documentName} deletado`, { id });
      return true;
    } catch (error) {
      debug.logger.error(`Serviço: Erro ao deletar ${this.documentName}`, { id, error });
      throw error;
    }
  }
}

export default Service;
