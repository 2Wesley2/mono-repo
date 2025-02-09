import debug from '../../../../debug/index.js';

class EmployeeRepository {
  constructor(model) {
    this.model = model;
  }

  async createEmployee(data) {
    try {
      const result = await this.model.createEmployee(data);
      debug.logger.info('Repositório: Documento criado', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao criar documento', { error });
      throw error;
    }
  }

  async findByIdEmployee(id) {
    try {
      const document = await this.model.findByIdEmployee(id);
      debug.logger.info('Repositório: Documento encontrado', { id });
      return document;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao buscar documento por ID', {
        id,
        error
      });
      throw error;
    }
  }

  async findAll(filters = {}, options = {}) {
    try {
      const documents = await this.model.findAll(filters, options);
      debug.logger.info('Repositório: Documentos encontrados', { filters });
      return documents;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao buscar documentos', {
        filters,
        error: error && error.message ? error.message : 'Erro desconhecido'
      });
      throw new Error('Erro ao buscar documentos no repositório.');
    }
  }

  async updateEmployee(id, data) {
    try {
      const result = await this.model.updateEmployee(id, data);
      debug.logger.info('Repositório: Documento atualizado', {
        id,
        data: result
      });
      return result;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao atualizar documento', {
        id,
        error
      });
      throw error;
    }
  }

  async deleteEmployee(id) {
    try {
      await this.model.deleteEmployee(id);
      debug.logger.info('Repositório: Documento deletado', { id });
      return true;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao deletar documento', {
        id,
        error
      });
      throw error;
    }
  }
}

export default EmployeeRepository;
