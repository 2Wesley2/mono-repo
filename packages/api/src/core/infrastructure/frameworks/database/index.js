import mongoose from 'mongoose';
import config from '../../../../config/index.js';

export default class Database {
  /**
   * Adiciona um middleware ao schema do Mongoose.
   *
   * @param {mongoose.Schema} schema - Schema Mongoose válido.
   * @param {string} type - O tipo de middleware ("pre" ou "post").
   * @param {string} event - O evento no qual o middleware será aplicado.
   * @param {Function} fn - Função middleware a ser executada.
   * @throws {Error} Lança erro se os argumentos não forem válidos.
   *
   * @example
   * Database.addMiddleware(mySchema, 'pre', 'save', function(next) {
   *   // lógica do middleware
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
  }

  /**
   * Conecta ao banco de dados utilizando as configurações definidas.
   *
   * @param {string} [dbName=config.dbName] - Nome do banco de dados.
   * @returns {Promise<void>} Uma Promise que é resolvida quando a conexão é bem-sucedida.
   *
   * @example
   * await Database.connect('meuBanco');
   */
  static async connect(dbName = config.dbName) {
    let dbUri;
    const options = {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000
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
      });

      mongoose.connection.on('disconnected', () => {
        console.log('Mongoose desconectado.');
      });
    } catch (error) {
      console.error(`Falha ao conectar ao banco ${dbName}:`, error.message);
      throw error;
    }
  }

  /**
   * Encerra a conexão com o banco de dados.
   *
   * @returns {Promise<void>} Uma Promise que é resolvida quando a conexão é encerrada.
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
   * Configura um schema Mongoose com opções e middlewares.
   *
   * @param {Object} params - Parâmetros de configuração.
   * @param {Object} params.schema - Definição do schema.
   * @param {Object} [params.options={}] - Opções para o schema.
   * @param {Array<{type: string, event: string, fn: Function}>} [params.middlewares=[]] - Middlewares a serem aplicados.
   * @returns {mongoose.Schema} O schema configurado.
   *
   * @example
   * const userSchema = Database.configSchema({
   *   schema: { name: { type: String, required: true } },
   *   options: { timestamps: true },
   *   middlewares: [{ type: 'pre', event: 'save', fn: function(next) { next(); } }]
   * });
   */
  static configSchema({ schema, options = {}, middlewares = [] }) {
    const newSchema = new mongoose.Schema(schema, options);
    middlewares.forEach(({ type, event, fn }) => {
      this.addMiddleware(newSchema, type, event, fn);
    });
    return newSchema;
  }

  /**
   * Cria um sub-schema (usado para subdocumentos) e aplica middlewares.
   *
   * Por padrão, define `{ _id: false }` para subdocumentos.
   *
   * @param {Object} definition - Definição do sub-schema.
   * @param {Object} [options={}] - Opções para o sub-schema.
   * @param {Array<{type: string, event: string, fn: Function}>} [middlewares=[]] - Middlewares a serem aplicados.
   * @returns {mongoose.Schema} O sub-schema criado.
   *
   * @example
   * const addressSubSchema = Database.subSchema({
   *   street: String,
   *   city: String
   * });
   */
  static subSchema(definition, options = {}, middlewares = []) {
    const opts = { _id: false, ...options };
    const subSchema = new mongoose.Schema(definition, opts);
    middlewares.forEach(({ type, event, fn }) => {
      this.addMiddleware(subSchema, type, event, fn);
    });
    return subSchema;
  }

  /**
   * Registra um modelo Mongoose a partir do schema fornecido.
   *
   * @param {Object} params - Parâmetros para registro do modelo.
   * @param {Object} params.schema - Definição do schema.
   * @param {string} params.modelName - Nome do modelo.
   * @param {Object} [params.options={}] - Opções adicionais para o schema.
   * @param {Array<{type: string, event: string, fn: Function}>} [params.middlewares=[]] - Middlewares a serem aplicados.
   * @returns {mongoose.Model} O modelo registrado.
   * @throws {Error} Lança erro se o schema ou modelName não forem válidos.
   *
   * @example
   * const UserModel = Database.registerModel({
   *   schema: { name: { type: String, required: true } },
   *   modelName: 'User',
   *   options: { timestamps: true },
   *   middlewares: [{ type: 'pre', event: 'save', fn: function(next) { next(); } }]
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
    const newOptions = { timestamps: true, ...options };
    const newSchema = this.configSchema({
      schema,
      options: newOptions,
      middlewares
    });
    const model = mongoose.model(modelName, newSchema);
    return model;
  }

  /**
   * Obtém o tipo ObjectId do Mongoose.
   *
   * @returns {mongoose.Schema.Types.ObjectId} O tipo ObjectId do Mongoose.
   *
   * @example
   * const ObjectId = Database.ObjectIdType;
   */
  static get ObjectIdType() {
    return mongoose.Schema.Types.ObjectId;
  }

  /**
   * Obtém os tipos disponíveis no Mongoose.
   *
   * @returns {mongoose.Schema.Types} Tipos disponíveis no Mongoose.
   *
   * @example
   * const types = Database.Types;
   */
  static get Types() {
    return mongoose.Schema.Types;
  }

  /**
   * Obtém o tipo Mixed do Mongoose.
   *
   * @returns {mongoose.Schema.Types.Mixed} O tipo Mixed do Mongoose.
   *
   * @example
   * const Mixed = Database.MixedType;
   */
  static get MixedType() {
    return mongoose.Schema.Types.Mixed;
  }

  /**
   * Valida se um ID é um ObjectId válido.
   *
   * @param {string} id - O ID a ser validado.
   * @returns {boolean} True se for válido, caso contrário, false.
   *
   * @example
   * const isValid = Database.isValidObjectId('60d5ec49fdd5cf0015fded23');
   */
  static isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  /**
   * Converte o valor fornecido para um mongoose.Types.ObjectId, se possível.
   *
   * @param {*} value - Valor que deverá ser convertido para ObjectId.
   * @returns {mongoose.Types.ObjectId} O ObjectId convertido.
   * @throws {Error} Caso o valor não possa ser convertido para um ObjectId válido.
   *
   * @example
   * const objId = Database.toObjectId('60d5ec49fdd5cf0015fded23');
   */
  static toObjectId(value) {
    if (mongoose.Types.ObjectId.isValid(value)) {
      // Se já for um ObjectId, ou se for uma string válida, cria e retorna uma nova instância.
      return new mongoose.Types.ObjectId(String(value));
    }
    throw new Error(`O valor fornecido (${value}) não é um ObjectId válido.`);
  }

  /**
   * Analisa um objeto e retorna uma string JSON com o tipo do objeto e um mapeamento das chaves para os tipos dos valores.
   *
   * @param {*} obj - O objeto a ser analisado.
   * @returns {string} JSON.stringify com a estrutura: { tipo: "tipo do objeto", obj: { chaves: tipo } }
   *
   * @example
   * const analysis = Database.analyzeObject({ name: 'Alice', age: 30 });
   * console.log(analysis);
   */
  static analyzeObject(obj) {
    if (!!(obj instanceof mongoose.Document)) {
      const structure = Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? 'array' : typeof value;
        return acc;
      }, {});
      return JSON.stringify({ tipo: 'mongoose documento', obj: structure }, null, 2);
    }
    if (!!Array.isArray(obj)) {
      const structure = Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? 'array' : typeof value;
        return acc;
      }, {});
      return JSON.stringify({ tipo: 'array', obj: structure }, null, 2);
    }
    if (!!(obj !== null && typeof obj === 'object')) {
      const structure = Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? 'array' : typeof value;
        return acc;
      }, {});
      return JSON.stringify({ tipo: 'objeto comum', obj: structure }, null, 2);
    }
    return JSON.stringify({ tipo: typeof obj, obj: {} }, null, 2);
  }

  /**
   * Exclui o banco de dados com o nome fornecido.
   *
   * @param {string} dbName - Nome do banco de dados a ser excluído.
   * @returns {Promise<void>} Uma Promise que é resolvida quando o banco é excluído com sucesso.
   * @throws {Error} Lança erro caso a exclusão falhe ou não haja conexão ativa.
   *
   * @example
   * await Database.dropDatabase('meuBanco');
   */
  static async dropDatabase(dbName) {
    if (typeof dbName !== 'string' || !dbName) {
      throw new Error('O nome do banco de dados deve ser uma string válida.');
    }

    if (mongoose.connection.readyState !== 1) {
      throw new Error('Não há conexão ativa com o MongoDB.');
    }

    try {
      const dbConnection = mongoose.connection.useDb(dbName);
      await dbConnection.dropDatabase();
      console.log(`Banco de dados "${dbName}" excluído com sucesso.`);
    } catch (error) {
      console.error(`Erro ao excluir o banco de dados "${dbName}":`, error);
      throw error;
    }
  }
}
