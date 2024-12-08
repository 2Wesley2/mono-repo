import mongoose from 'mongoose';
import config from '../config/index.js';
import { addValidations } from '../helpers/addValidations.js';
import { findWithPlugin, uniqueKeyPlugin } from '../plugins/index.js';

export default class Database {
  /**
   * Conecta ao banco de dados MongoDB.
   * @param {string} dbName - Nome do banco de dados.
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
        console.warn('Mongoose desconectado. Tentando reconectar...');
      });
    } catch (error) {
      console.error(`Falha ao conectar ao banco ${dbName}:`, error.message);
      throw error;
    }
  }

  /**
   * Desconecta do banco de dados MongoDB.
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
   * @param {Object} param0
   * @param {Object} param0.schema - Definição do schema.
   * @param {Object} [param0.options] - Opções do schema.
   * @returns {mongoose.Schema} - Schema configurado.
   */
  static configSchema({ schema, options = {} }) {
    const newOptions = { timestamps: true, ...options };
    const newSchema = new mongoose.Schema(schema, newOptions);
    newSchema.plugin(uniqueKeyPlugin);
    newSchema.plugin(findWithPlugin);
    return newSchema;
  }

  /**
   * Registra e configura um modelo Mongoose.
   *
   * @param {Object} param0 - Configurações do modelo.
   * @param {Object} param0.schema - Definição do schema.
   * @param {string} param0.modelName - Nome do modelo.
   * @param {Object} [param0.options={}] - Opções do schema.
   * @param {Array<Function>|Function} [param0.validations=[]] - Funções de validação.
   * @returns {mongoose.Model} - Modelo registrado.
   */
  static registerModel({ schema, modelName, options = {}, validations = [] }) {
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

    const newSchema = this.configSchema({ schema, options });
    addValidations(newSchema, validations);
    const model = mongoose.model(modelName, newSchema);
    console.log(`Modelo registrado: "${modelName}"`, model);
    return model;
  }

  /**
   * Retorna o ObjectId do Mongoose.
   */
  static get ObjectId() {
    return mongoose.Schema.Types.ObjectId;
  }

  static get Types() {
    return mongoose.Schema.Types;
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
