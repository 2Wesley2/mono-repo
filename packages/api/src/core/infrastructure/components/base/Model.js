import mongoose from 'mongoose';
import loaders from '../../../loaders/index.js';

/**
 * Classe base para criação de modelos Mongoose com métodos personalizados.
 *
 * Esta classe encapsula a criação do modelo e a anexação de métodos customizados,
 * evitando a sobrescrita de métodos padrão do Mongoose.
 *
 * @class Model
 *
 * @example
 * // Exemplo de criação de um modelo customizado estendendo a classe Model:
 * import Model from './Model.js';
 *
 * class UserModel extends Model {
 *   constructor() {
 *     super({
 *       name: { type: String, required: true },
 *       email: { type: String, required: true },
 *     }, 'User');
 *   }
 *
 *   /**
 *    * Método customizado para encontrar usuários por email.
 *    *
 *    * @param {string} email - Email do usuário a ser procurado.
 *    * @returns {Promise<Object|null>} O usuário encontrado ou null.
 *    *\/
 *   async findByEmail(email) {
 *     return this.model.findOne({ email });
 *   }
 * }
 *
 * export default new UserModel();
 */
export default class Model {
  /**
   * Cria uma instância do modelo.
   *
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
     * O modelo Mongoose configurado.
     *
     * @type {mongoose.Model}
     */
    this.model = loaders.mongoose.registerModel(schema, modelName, options, middlewares);

    this.attachCustomMethods();
  }

  /**
   * Analisa um objeto e retorna uma string JSON com informações sobre seus tipos.
   *
   * @param {*} obj - O objeto a ser analisado.
   * @returns {string} JSON contendo o tipo do objeto e um mapeamento das chaves para os tipos dos valores.
   *
   * @example
   * const analysis = Model.analyzeObject({ name: 'Alice', age: 30 });
   * console.log(analysis);
   */
  static analyzeObject(obj) {
    return loaders.mongoose.analyzeObject(obj);
  }

  /**
   * Valida se o ID fornecido é um ObjectId válido.
   *
   * @param {string} id - O ID a ser validado.
   * @returns {boolean} True se o ID for válido, caso contrário, false.
   *
   * @example
   * const isValid = Model.isValidObjectId('60d5ec49fdd5cf0015fded23');
   * console.log(isValid); // true ou false
   */
  static isValidObjectId(id) {
    return loaders.mongoose.isValidObjectId(id);
  }

  /**
   * Obtém os tipos disponíveis no Mongoose.
   *
   * @readonly
   * @type {mongoose.Schema.Types}
   *
   * @example
   * const types = Model.getTypes;
   * console.log(types);
   */
  static get getTypes() {
    return loaders.mongoose.getTypes();
  }

  /**
   * Obtém o tipo ObjectId do Mongoose.
   *
   * @readonly
   * @type {mongoose.Schema.Types.ObjectId}
   *
   * @example
   * const ObjectId = Model.objectIdType;
   * console.log(ObjectId);
   */
  static get objectIdType() {
    return loaders.mongoose.getObjectIdType();
  }

  /**
   * Obtém o tipo Mixed do Mongoose.
   *
   * @readonly
   * @type {mongoose.Schema.Types.Mixed}
   *
   * @example
   * const Mixed = Model.getMixedType;
   * console.log(Mixed);
   */
  static get getMixedType() {
    return loaders.mongoose.getMixedType();
  }

  /**
   * Anexa métodos personalizados à instância do modelo, garantindo que não sobrescrevam métodos padrão do Mongoose.
   *
   * Este método percorre os métodos definidos na classe derivada (exceto o construtor e métodos que iniciam com "_")
   * e os vincula à instância do modelo, caso não haja conflito com métodos nativos.
   *
   * @throws {Error} Lança um erro se um método tentar sobrescrever métodos padrão do Mongoose.
   *
   * @example
   * // Ao criar um método customizado na classe derivada, este será automaticamente anexado ao modelo Mongoose.
   * class MyModel extends Model {
   *   customMethod() {
   *     // implementação do método
   *   }
   * }
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
      'update' // (descontinuado) Atualiza documentos (não deve ser usado, mas ainda funciona em versões antigas)
    );

    /**
     * Array contendo os nomes dos métodos customizados definidos na classe derivada.
     *
     * @type {string[]}
     */
    const customMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(
      (method) => method !== 'constructor' && typeof this[method] === 'function' && !method.startsWith('_') // Ignora métodos que começam com "_"
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
