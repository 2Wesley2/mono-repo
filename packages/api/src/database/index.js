import mongoose from 'mongoose';
import config from '../config/index.js';
import { toArray } from '../helpers/arrayHelper.js';

/**
 * Plugin que adiciona métodos estáticos findWith e existsWith aos schemas do Mongoose.
 *
 * @param {mongoose.Schema} newSchema - O schema do Mongoose ao qual o plugin será aplicado.
 * @returns {mongoose.Schema} - O schema configurado com os novos métodos.
 */
const findWithPlugin = (newSchema) => {
  /**
   * Encontra um documento que corresponde aos parâmetros fornecidos, excluindo os IDs especificados.
   *
   * @param {Object} params - Parâmetros de busca.
   * @param {Array<string|mongoose.Types.ObjectId>|string} [params.excludedIds] - IDs a serem excluídos da busca.
   * @returns {Promise<mongoose.Document|null>} - O documento encontrado ou null se nenhum for encontrado.
   */
  newSchema.statics.findWith = async function findWith({ excludedIds, ...params }) {
    return this.findOne({
      ...params,
      ...(excludedIds ? { _id: { $nin: toArray(excludedIds) } } : {}),
    });
  };

  /**
   * Verifica se existe um documento que corresponde aos parâmetros fornecidos, excluindo os IDs especificados.
   *
   * @param {Object} params - Parâmetros de busca.
   * @param {Array<string|mongoose.Types.ObjectId>|string} [params.excludedIds] - IDs a serem excluídos da verificação.
   * @returns {Promise<boolean>} - True se existir, false caso contrário.
   */
  newSchema.statics.existsWith = async function existsWith({ excludedIds, ...params }) {
    const document = await this.findOne({
      ...params,
      ...(excludedIds ? { _id: { $nin: toArray(excludedIds) } } : {}),
    });

    return Boolean(document);
  };

  return newSchema;
};

export default class Database {
  /**
   * Conecta ao banco de dados MongoDB.
   * @param {string} dbName - Nome do banco de dados.
   */
  static async connect(dbName = config.dbName) {
    let dbUri;
    let message;
    const options = {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
    };
    try {
      if (config.dbAtlas) {
        dbUri = `mongodb+srv://${encodeURIComponent(config.dbUser)}:${encodeURIComponent(config.dbPassword)}@${config.dbHost}/${dbName}?retryWrites=true&w=majority`;
        message = `Database class:Mongo is connected to ${dbName} on Atlas!`;
      } else if (config.dbHost && config.dbPort) {
        dbUri = `mongodb://${config.dbHost}:${config.dbPort}/${dbName}`;
        message = `Database class: Mongo is connected to ${dbName} on port ${config.dbPort}!`;
      } else {
        throw new Error(
          'Database class: Configuração do banco de dados inválida. Verifique dbAtlas ou dbHost e dbPort.',
        );
      }

      await mongoose.connect(dbUri, options);
      console.log(message);

      mongoose.connection.on('connected', () => {
        console.log('Database class: Mongoose connected to ' + dbUri);
      });

      mongoose.connection.on('error', (err) => {
        console.error('Database class: Mongoose connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('Database class: Mongoose disconnected. Tentando reconectar...');
      });
    } catch (error) {
      console.error(`
Database class: Fail to connect to ${dbName} database!
${error.message}`);
      throw error;
    }
  }

  /**
   * Desconecta do banco de dados MongoDB.
   */
  static async disconnect() {
    try {
      await mongoose.connection.close();
      console.log('Database class: Database connection closed.');
    } catch (error) {
      console.error('Database class: Error closing database connection:', error);
    }
  }

  /**
   * Configura o schema do Mongoose com opções e plugins personalizados.
   * @param {Object} param0
   * @param {Object} param0.schema - Definição do schema.
   * @param {Object} [param0.options] - Opções do schema.
   * @returns {mongoose.Schema} - Schema configurado.
   */
  static configSchema({ schema, options = {} }) {
    const newOptions = { timestamps: true, ...options };
    const newSchema = new mongoose.Schema(schema, newOptions);
    findWithPlugin(newSchema);
    return newSchema;
  }

  /**
   * Configura e registra um modelo Mongoose.
   * @param {Object} param0
   * @param {Object} param0.schema - Definição do schema.
   * @param {string} modelName - Nome do modelo.
   * @param {Object} [param0.options] - Opções do schema.
   * @returns {mongoose.Model} - O modelo registrado.
   */
  static registerModel({ schema, modelName, options = {} }) {
    const newSchema = this.configSchema({ schema, options });
    return mongoose.model(modelName, newSchema);
  }

  static get Types() {
    return mongoose.Types;
  }

  /**
   * Retorna o ObjectId do Mongoose.
   * @returns {mongoose.Schema.Types.ObjectId}
   */
  static get ObjectId() {
    return mongoose.Schema.Types.ObjectId;
  }

  /**
   * Valida um ObjectId.
   * @param {string} id - O ID a ser validado.
   * @returns {boolean} - True se o ID for válido, caso contrário, false.
   */
  static isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}
