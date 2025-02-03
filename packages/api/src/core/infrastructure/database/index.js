import mongoose from 'mongoose';
import config from '../../../config/index.js';

export default class Database {
  /**
   * Adiciona um middleware ao schema do Mongoose.
   * @param {mongoose.Schema} schema - Schema Mongoose válido.
   * @param {string} type - O tipo de middleware ("pre" ou "post").
   * @param {string} event - O evento no qual o middleware será aplicado.
   * @param {Function} fn - Função middleware a ser executada.
   * @throws {Error} Lança erro se os argumentos não forem válidos.
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
  }

  /**
   * Conecta ao banco de dados utilizando as configurações definidas.
   * @param {string} [dbName=config.dbName] - Nome do banco de dados.
   * @returns {Promise<void>} - Uma Promise que é resolvida quando a conexão é bem-sucedida.
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
   * Encerra a conexão com o banco de dados.
   * @returns {Promise<void>} - Uma Promise que é resolvida quando a conexão é encerrada.
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
   * Configura um schema Mongoose com opções e middlewares.
   * @param {Object} params - Parâmetros de configuração.
   * @param {Object} params.schema - Definição do schema.
   * @param {Object} [params.options={}] - Opções para o schema.
   * @param {Array<{type: string, event: string, fn: Function}>} [params.middlewares=[]] - Middlewares a serem aplicados.
   * @returns {mongoose.Schema} - O schema configurado.
   */
  static configSchema({ schema, options = {}, middlewares = [] }) {
    const newOptions = { timestamps: true, ...options };
    const newSchema = new mongoose.Schema(schema, newOptions);
    middlewares.forEach(({ type, event, fn }) => {
      this.addMiddleware(newSchema, type, event, fn);
    });
    return newSchema;
  }

  /**
   * Registra um modelo Mongoose a partir do schema fornecido.
   * @param {Object} params - Parâmetros para registro do modelo.
   * @param {Object} params.schema - Definição do schema.
   * @param {string} params.modelName - Nome do modelo.
   * @param {Object} [params.options={}] - Opções adicionais para o schema.
   * @param {Array<{type: string, event: string, fn: Function}>} [params.middlewares=[]] - Middlewares a serem aplicados.
   * @returns {mongoose.Model} - O modelo registrado.
   * @throws {Error} Lança erro se o schema ou modelName não forem válidos.
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
   * @returns {mongoose.Schema.Types.ObjectId} - O tipo ObjectId do Mongoose.
   */
  static get ObjectIdType() {
    return mongoose.Schema.Types.ObjectId;
  }

  /**
   * @returns {mongoose.Schema.Types} - Tipos disponíveis no Mongoose.
   */
  static get Types() {
    return mongoose.Schema.Types;
  }

  /**
   * Obtém o tipo Mixed do Mongoose.
   * @returns {mongoose.Schema.Types.Mixed} - O tipo Mixed do Mongoose.
   */

  static get MixedType() {
    return mongoose.Schema.Types.Mixed;
  }

  /**
   * Valida se um ID é um ObjectId válido.
   * @param {string} id - O ID a ser validado.
   * @returns {boolean} - True se for válido, caso contrário false.
   */
  static isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}
