import mongoose from 'mongoose';
import loaders from '../../../loaders/index.js';

/**
 * Classe base para criação de modelos Mongoose com métodos personalizados.
 */
export default class Model {
  /**
   * Cria uma instância do modelo.
   * @param {Object} schema - Definição do schema do modelo.
   * @param {string} modelName - Nome do modelo.
   * @param {Object} [options={}] - Opções adicionais para o schema.
   * @param {Array<{type: string, event: string, fn: Function}>} [middlewares=[]] - Middlewares a serem aplicados.
   * @throws {Error} Lança erro se o schema estiver vazio.
   */
  constructor(schema = {}, modelName, options = {}, middlewares = []) {
    if (!Object.keys(schema).length) {
      throw new Error('O esquema fornecido não pode estar vazio.');
    }
    /**
     * @type {mongoose.Model}
     * O modelo Mongoose configurado.
     */
    this.model = loaders.mongoose.registerModel(schema, modelName, options, middlewares);

    this.attachCustomMethods();
  }

  static analyzeObject(obj) {
    return loaders.mongoose.analyzeObject(obj);
  }

  /**
   * Valida se o ID fornecido é um ObjectId válido.
   * @param {string} id - O ID a ser validado.
   * @returns {boolean} - True se o ID for válido, caso contrário, false.
   */
  static isValidObjectId(id) {
    return loaders.mongoose.isValidObjectId(id);
  }

  /**
   * @returns {mongoose.Schema.Types} - Os tipos disponíveis no Mongoose.
   */
  static get getTypes() {
    return loaders.mongoose.getTypes();
  }

  /**
   * @returns {mongoose.Schema.Types.ObjectId} - O tipo ObjectId do Mongoose.
   */
  static get objectIdType() {
    return loaders.mongoose.getObjectIdType();
  }

  /**
   * Obtém o tipo Mixed do Mongoose.
   *
   * @returns {mongoose.Schema.Types.Mixed} - Tipo Mixed do Mongoose.
   * @example
   * const Mixed = Model.getMixedType();
   */
  static get getMixedType() {
    return loaders.mongoose.getMixedType();
  }

  /**
   * Anexa métodos personalizados à instância do modelo.
   * @throws {Error} Lança um erro se um método tentar sobrescrever métodos padrão do Mongoose.
   */
  attachCustomMethods() {
    const reservedMethods = new Array(
      'save', // Salva o documento no banco
      'find', // Realiza consultas no banco
      'findOne', // Encontra um único documento
      'findById', // Encontra um documento pelo ObjectId
      'findByIdAndUpdate', // Atualiza um documento pelo ObjectId
      'findByIdAndDelete', // Remove um documento pelo ObjectId
      'findOneAndUpdate', // Atualiza um único documento
      'findOneAndDelete', // Remove um único documento
      'updateOne', // Atualiza um único documento
      'updateMany', // Atualiza vários documentos
      'deleteOne', // Remove um único documento
      'deleteMany', // Remove vários documentos
      'remove', // Remove documentos (obsoleto, mas ainda funcional)
      'count', // Retorna a contagem de documentos (deprecated)
      'countDocuments', // Retorna a contagem de documentos
      'estimatedDocumentCount', // Retorna uma estimativa da contagem total
      'aggregate', // Realiza operações de agregação
      'populate', // Popula referências de outros documentos
      'exec', // Executa consultas e operações
      'lean', // Retorna documentos "lean" (sem métodos adicionais do Mongoose)
      'toObject', // Converte o documento para um objeto JavaScript
      'toJSON', // Converte o documento para JSON
      'create', // Cria e salva documentos
      'update', // (descontinuado) Atualiza documentos (não deve ser usado, mas ainda funciona em versões antigas)
    );

    /**
     * @type {string[]}
     * Métodos personalizados definidos na classe derivada.
     */
    const customMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(
      (method) => method !== 'constructor' && typeof this[method] === 'function' && !method.startsWith('_'), // Ignora métodos que começam com "_"
    );

    customMethods.forEach((method) => {
      const isNativeMethod = Object.prototype.hasOwnProperty.call(Object.prototype, method);
      if (isNativeMethod) {
        return;
      }
      if (reservedMethods.includes(method)) {
        throw new Error(`Método "${method}" não pode sobrescrever métodos padrão do Mongoose.`);
      }
      this.model[method] = this[method].bind(this);
    });
  }
}
