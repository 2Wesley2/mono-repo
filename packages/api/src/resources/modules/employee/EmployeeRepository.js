import debug from '../../../debug/index.js';

class EmployeeRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const result = await this.model.create(data);
      debug.logger.info('Repositório: Documento criado', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao criar documento', { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      const document = await this.model.findById(id);
      debug.logger.info('Repositório: Documento encontrado', { id });
      return document;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao buscar documento por ID', { id, error });
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
        error: error && error.message ? error.message : 'Erro desconhecido',
      });
      throw new Error('Erro ao buscar documentos no repositório.');
    }
  }

  async update(id, data) {
    try {
      const result = await this.model.update(id, data);
      debug.logger.info('Repositório: Documento atualizado', { id, data: result });
      return result;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao atualizar documento', { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.model.delete(id);
      debug.logger.info('Repositório: Documento deletado', { id });
      return true;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao deletar documento', { id, error });
      throw error;
    }
  }
}

export default EmployeeRepository;
