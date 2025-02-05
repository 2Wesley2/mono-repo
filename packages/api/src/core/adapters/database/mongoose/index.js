import mongoose from 'mongoose';
import Database from '../../../infrastructure/frameworks/database/index.js';

/**
 * Centraliza a exportação de métodos e getters da classe Database.
 */
export default {
  /**
   * Inicializa a conexão com o banco de dados.
   *
   * @param {string} [dbName] - Nome do banco de dados a ser conectado. Padrão: configurado em `Database`.
   * @returns {Promise<void>} - Retorna uma Promise resolvida quando a conexão é bem-sucedida.
   * @example
   * import db from '../database/index.js';
   * await db.init('meuBanco');
   */
  init: Database.connect,

  /**
   * Encerra a conexão com o banco de dados.
   *
   * @returns {Promise<void>} - Retorna uma Promise resolvida após o encerramento.
   * @example
   * import db from '../database/index.js';
   * await db.disconnect();
   */
  disconnect: Database.disconnect,

  /**
   * Registra um modelo Mongoose com base no schema fornecido.
   *
   * @param {Object} schema - Definição do schema do modelo.
   * @param {string} modelName - Nome do modelo a ser registrado.
   * @param {Object} [options={}] - Opções adicionais para o schema.
   * @param {Array<{type: string, event: string, fn: Function}>} [middlewares=[]] - Middlewares a serem adicionados ao schema.
   * @returns {mongoose.Model} - Retorna o modelo registrado.
   * @example
   * import db from '../database/index.js';
   * const userSchema = { name: { type: String, required: true } };
   * const middlewares = [
   *   { type: 'pre', event: 'save', fn: function(next) { console.log('Salvando...'); next(); } },
   * ];
   * const UserModel = db.registerModel(userSchema, 'User', {}, middlewares);
   */
  registerModel: (schema, modelName, options = {}) => Database.registerModel({ schema, modelName, options }),

  /**
   * Obtém os tipos de schema do Mongoose.
   *
   * @returns {mongoose.Schema.Types} - Tipos disponíveis no Mongoose.
   * @example
   * import db from '../database/index.js';
   * const types = db.getTypes();
   * console.log(types.ObjectId);
   */
  getTypes: () => Database.Types,

  /**
   * Obtém o tipo ObjectId do Mongoose.
   *
   * @returns {mongoose.Schema.Types.ObjectId} - Tipo ObjectId do Mongoose.
   * @example
   * import db from '../database/index.js';
   * const ObjectId = db.getObjectId();
   */
  getObjectIdType: () => Database.ObjectIdType,

  /**
   * Valida se um ID fornecido é um ObjectId válido.
   *
   * @param {string} id - O ID a ser validado.
   * @returns {boolean} - True se o ID for válido, caso contrário, false.
   * @example
   * import db from '../database/index.js';
   * const isValid = db.isValidObjectId('60d5ec49fdd5cf0015fded23');
   * console.log(isValid); // true
   */
  isValidObjectId: (id) => Database.isValidObjectId(id),

  /**
   * Obtém o tipo Mixed do Mongoose.
   *
   * @returns {mongoose.Schema.Types.Mixed} - Tipo Mixed do Mongoose.
   * @example
   * import db from '../database/index.js';
   * const Mixed = db.getMixedType();
   */
  getMixedType: () => Database.getMixedType(),

  toObjectId: (...args) => Database.toObjectId(...args),
};
