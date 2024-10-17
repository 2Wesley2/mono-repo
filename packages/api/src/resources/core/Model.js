import Database from '../../database/index.js';
import config from '../../config/index.js';

class Model {
  constructor(schema, modelName) {
    this.model = Database.registerModel({ schema, modelName });
  }

  async create(data) {
    try {
      const newDocument = new this.model(data);
      const result = await newDocument.save();
      config.logger.info(`${modelName}: Documento criado com sucesso`, { data: result });
      return result;
    } catch (error) {
      config.logger.error(`${modelName}: Erro ao criar documento`, { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      if (!Database.isValidObjectId(id)) {
        throw new Error('ID inválido');
      }
      const document = await this.model.findById(id);
      if (document) {
        config.logger.info(`${modelName}: Documento encontrado`, { id });
      } else {
        config.logger.warn(`${modelName}: Documento não encontrado`, { id });
      }
      return document;
    } catch (error) {
      config.logger.error(`${modelName}: Erro ao buscar documento por ID`, { id, error });
      throw error;
    }
  }

  async update(id, data) {
    try {
      if (!Database.isValidObjectId(id)) {
        throw new Error('ID inválido');
      }
      const updatedDocument = await this.model.findByIdAndUpdate(id, data, { new: true });
      config.logger.info(`${modelName}: Documento atualizado`, { id, data: updatedDocument });
      return updatedDocument;
    } catch (error) {
      config.logger.error(`${modelName}: Erro ao atualizar documento`, { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!Database.isValidObjectId(id)) {
        throw new Error('ID inválido');
      }
      await this.model.findByIdAndDelete(id);
      config.logger.info(`${modelName}: Documento deletado`, { id });
      return true;
    } catch (error) {
      config.logger.error(`${modelName}: Erro ao deletar documento`, { id, error });
      throw error;
    }
  }
}

export default Model;
