import { toArray } from '../helpers/arrayHelper.js';

/**
 * Plugin que adiciona métodos estáticos para busca e verificação de exclusões a um schema do Mongoose.
 *
 * @param {mongoose.Schema} newSchema - O schema do Mongoose ao qual o plugin será aplicado.
 * @returns {mongoose.Schema} - O schema configurado com os novos métodos.
 */
const findWithPlugin = (newSchema) => {
  /**
   * Encontra um documento baseado nos parâmetros fornecidos, excluindo IDs especificados.
   *
   * @param {Object} params - Parâmetros de busca.
   * @param {Array<string|mongoose.Types.ObjectId>|string} [params.excludedIds] - IDs a serem excluídos.
   * @returns {Promise<mongoose.Document|null>} - Documento encontrado ou `null` se nenhum for encontrado.
   */
  newSchema.statics.findExcludingIds = async function ({ excludedIds, ...params }) {
    return this.findOne({
      ...params,
      ...(excludedIds ? { _id: { $nin: toArray(excludedIds) } } : {}),
    });
  };

  /**
   * Verifica se existe um documento baseado nos parâmetros fornecidos, excluindo IDs especificados.
   *
   * @param {Object} params - Parâmetros de busca.
   * @param {Array<string|mongoose.Types.ObjectId>|string} [params.excludedIds] - IDs a serem excluídos.
   * @returns {Promise<boolean>} - `true` se encontrado, `false` caso contrário.
   */
  newSchema.statics.existsExcludingIds = async function ({ excludedIds, ...params }) {
    const document = await this.findOne({
      ...params,
      ...(excludedIds ? { _id: { $nin: toArray(excludedIds) } } : {}),
    });

    return Boolean(document);
  };

  return newSchema;
};

export default findWithPlugin;
