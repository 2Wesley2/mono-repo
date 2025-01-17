import mongoose from 'mongoose';
import config from '../config/index.js';
import { findWithPlugin, uniqueKeyPlugin } from '../plugins/index.js';

/**
 * Classe responsável pela gestão de conexões e configuração de schemas no MongoDB usando Mongoose.
 */
export default class Database {
  /**
   * Adiciona um middleware a um schema existente.
   *
   * @param {mongoose.Schema} schema - O schema Mongoose alvo.
   * @param {string} type - Tipo de middleware (ex: 'pre', 'post').
   * @param {string} event - O evento alvo (ex: 'save', 'findOneAndUpdate').
   * @param {Function} fn - A função do middleware.
   * @example
   * const schema = new mongoose.Schema({ name: String });
   * Database.addMiddleware(schema, 'pre', 'save', function(next) {
   *   console.log('Salvando documento...');
   *   next();
   * });
   */
  static addMiddleware(schema, type, event, fn) {
    if (!schema || !(schema instanceof mongoose.Schema)) {
      throw new Error('O primeiro argumento deve ser um schema Mongoose válido.');
    }
    if (!['pre', 'post'].includes(type)) {
      throw new Error(`O tipo de middleware "${type}" é inválido. Use "pre" ou "post".`);
    }
    if (typeof event !== 'string' || typeof fn !== 'function') {
      throw new Error('Os argumentos "event" e "fn" devem ser uma string e uma função, respectivamente.');
    }

    schema[type](event, fn);
    console.log(`Middleware ${type}-${event} adicionado com sucesso ao schema.`);
  }

  /**
   * Conecta ao banco de dados MongoDB.
   *
   * @param {string} dbName - Nome do banco de dados.
   * @throws {Error} Lança um erro caso a conexão falhe.
   * @example
   * await Database.connect('meuBanco');
   */
  static async connect(dbName = config.dbName) {
    let dbUri;
    const options = {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
    };

    try {
      if (config.dbAtlas) {
        dbUri = `mongodb+srv://${encodeURIComponent(config.dbUser)}:${encodeURIComponent(config.dbPassword)}@${config.dbHost}/${dbName}?retryWrites=true&w=majority`;
        console.log(`MongoDB conectado ao banco ${dbName} no Atlas.`);
      } else if (config.dbHost && config.dbPort) {
        dbUri = `mongodb://${config.dbHost}:${config.dbPort}/${dbName}`;
        console.log(`MongoDB conectado ao banco ${dbName} na porta ${config.dbPort}.`);
      } else {
        throw new Error('Configuração do banco de dados inválida. Verifique dbAtlas ou dbHost e dbPort.');
      }

      await mongoose.connect(dbUri, options);

      mongoose.connection.on('connected', () => {
        console.log(`Mongoose conectado a ${dbUri}`);
      });

      mongoose.connection.on('error', (err) => {
        console.error('Erro na conexão com o MongoDB:', err);
        setTimeout(() => {
          console.log('Tentando reconectar...');
          mongoose.connect(dbUri, options).catch(console.error);
        }, 5000);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('Mongoose desconectado.');
      });
    } catch (error) {
      console.error(`Falha ao conectar ao banco ${dbName}:`, error.message);
      throw error;
    }
  }

  /**
   * Desconecta do banco de dados MongoDB.
   *
   * @example
   * await Database.disconnect();
   */
  static async disconnect() {
    try {
      await mongoose.connection.close();
      console.log('Conexão com o banco de dados encerrada.');
    } catch (error) {
      console.error('Erro ao encerrar a conexão:', error);
    }
  }

  /**
   * Configura o schema do Mongoose com opções e plugins personalizados.
   *
   * @param {Object} param0 - Objeto de configuração.
   * @param {Object} param0.schema - Definição do schema.
   * @param {Object} [param0.options] - Opções adicionais para o schema.
   * @param {Array<{type: string, event: string, fn: Function}>} [param0.middlewares=[]] - Middlewares a serem adicionados.
   * @returns {mongoose.Schema} - Schema configurado.
   * @example
   * const schema = Database.configSchema({
   *   schema: { name: { type: String, required: true } },
   *   options: { timestamps: true },
   * });
   */

  static configSchema({ schema, options = {}, middlewares = [] }) {
    const newOptions = { timestamps: true, ...options };
    const newSchema = new mongoose.Schema(schema, newOptions);
    newSchema.plugin(uniqueKeyPlugin);
    newSchema.plugin(findWithPlugin);
    middlewares.forEach(({ type, event, fn }) => {
      console.log(`Registrando middleware: ${type}-${event}`);
      this.addMiddleware(newSchema, type, event, fn);
    });
    return newSchema;
  }

  /**
   * Registra e configura um modelo Mongoose.
   *
   * @param {Object} param0 - Configurações do modelo.
   * @param {Object} param0.schema - Definição do schema.
   * @param {string} param0.modelName - Nome do modelo.
   * @param {Object} [param0.options={}] - Opções do schema.
   * @param {Array<{type: string, event: string, fn: Function}>} [param0.middlewares=[]] - Middlewares a serem aplicados.
   * @returns {mongoose.Model} - Modelo registrado.
   * @example
   * const userSchema = { name: { type: String, required: true } };
   * const UserModel = Database.registerModel({
   *   schema: userSchema,
   *   modelName: 'User',
   * });
   */

  static registerModel({ schema, modelName, options = {}, middlewares = [] }) {
    if (!schema || typeof schema !== 'object') {
      throw new Error('Schema inválido ou não fornecido.');
    }

    if (!modelName || typeof modelName !== 'string') {
      throw new Error(`O nome do modelo deve ser uma string válida. Recebido: ${modelName}`);
    }

    if (mongoose.models[modelName]) {
      console.log(`Modelo "${modelName}" já está registrado.`);
      return mongoose.models[modelName];
    }

    const newSchema = this.configSchema({ schema, options, middlewares });
    const model = mongoose.model(modelName, newSchema);
    return model;
  }

  /**
   * Retorna o tipo ObjectId do Mongoose.
   *
   * @returns {mongoose.Schema.Types.ObjectId} - Tipo ObjectId.
   */
  static get ObjectIdType() {
    return mongoose.Schema.Types.ObjectId;
  }

  /**
   * Retorna os tipos padrão do Mongoose.
   *
   * @returns {mongoose.Schema.Types} - Tipos do schema do Mongoose.
   */
  static get Types() {
    return mongoose.Schema.Types;
  }

  /**
   * Valida um ObjectId.
   *
   * @param {string} id - O ID a ser validado.
   * @returns {boolean} - True se o ID for válido, caso contrário, false.
   * @example
   * const isValid = Database.isValidObjectId('60d5ec49fdd5cf0015fded23');
   * console.log(isValid); // true
   */
  static isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}
