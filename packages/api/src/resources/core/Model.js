import loaders from '../../loaders/index.js';
import debug from '../../debug/index.js';

class Model {
  constructor(schema, modelName) {
    this.model = loaders.mongoose.registerModel({ schema, modelName });
    this.modelName = modelName;
  }

  async create(data) {
    try {
      const newDocument = new this.model(data);
      const result = await newDocument.save();
      debug.logger.info(`Model.js: ${this.modelName}: Documento criado com sucesso`, { data: result });
      return result;
    } catch (error) {
      debug.logger.error(`Model.js: ${this.modelName}: Erro ao criar documento`, { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      if (!loaders.mongoose.isValidObjectId(id)) {
        throw new Error('ID inválido');
      }
      const document = await this.model.findById(id);
      if (document) {
        debug.logger.info(`Model.js: ${this.modelName}: Documento encontrado`, { id });
      } else {
        debug.logger.warn(`Model.js: ${this.modelName}: Documento não encontrado`, { id });
      }
      return document;
    } catch (error) {
      debug.logger.error(`Model.js: ${this.modelName}: Erro ao buscar documento por ID`, { id, error });
      throw error;
    }
  }

  async update(id, data) {
    try {
      if (!loaders.mongoose.isValidObjectId(id)) {
        throw new Error('ID inválido');
      }
      const updatedDocument = await this.model.findByIdAndUpdate(id, data, { new: true });
      debug.logger.info(`Model.js: ${this.modelName}: Documento atualizado`, { id, data: updatedDocument });
      return updatedDocument;
    } catch (error) {
      debug.logger.error(`Model.js: ${this.modelName}: Erro ao atualizar documento`, { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!loaders.mongoose.isValidObjectId(id)) {
        throw new Error('ID inválido');
      }
      await this.model.findByIdAndDelete(id);
      debug.logger.info(`Model.js: ${this.modelName}: Documento deletado`, { id });
      return true;
    } catch (error) {
      debug.logger.error(`Model.js: ${this.modelName}: Erro ao deletar documento`, { id, error });
      throw error;
    }
  }
}

export default Model;
