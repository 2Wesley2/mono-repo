import debug from '../debug/index.js';
import AppError from '../errors/AppError.js';
/**
 * Plugin que adiciona métodos estáticos para busca e atualização com base em chaves únicas a um schema do Mongoose.
 *
 * @param {mongoose.Schema} newSchema - O schema do Mongoose ao qual o plugin será aplicado.
 * @returns {mongoose.Schema} - O schema configurado com os novos métodos.
 */
const uniqueKeyPlugin = (newSchema) => {
  /**
   * Garante que o filtro seja um objeto válido.
   *
   * @param {Object} filter - O filtro a ser validado.
   * @returns {Object} - O filtro corrigido ou um erro, se irreparável.
   */
  const ensureValidFilter = (filter) => {
    if (!filter || typeof filter !== 'object' || typeof filter === 'string' || Array.isArray(filter)) {
      return null;
    }

    if (Object.keys(filter).length === 0) {
      return null;
    }

    return filter;
  };

  /**
   * Garante que o valor fornecido seja válido para o tipo esperado.
   *
   * @param {*} value - Valor a ser validado.
   * @param {string} type - Tipo esperado (por exemplo, 'number').
   * @returns {boolean} - Retorna `true` se o valor for válido, caso contrário, `false`.
   */
  const ensureValidValue = (value, type) => {
    if (type === 'number' && (typeof value !== 'number' || isNaN(value))) {
      return false;
    }
    // Adicione mais validações de tipo conforme necessário
    return true;
  };

  /**
   * Encontra um documento com base em uma chave única.
   *
   * @param {Object} filter - Filtro contendo a chave única e seu valor.
   * @returns {Promise<mongoose.Document|null>} - Documento encontrado ou `null` se nenhum for encontrado.
   */
  newSchema.statics.findByUniqueKey = async function (filter) {
    if (filter === null || filter === undefined) {
      throw new AppError(400, 'Filtro inválido: Valor nulo ou indefinido.');
    }

    const validatedFilter = ensureValidFilter(filter);

    if (!validatedFilter) {
      throw new AppError(400, 'Filtro inválido: Não foi possível executar a busca.');
    }

    const uniqueKey = Object.keys(validatedFilter)[0];
    const value = validatedFilter[uniqueKey];

    if (!ensureValidValue(value, typeof value)) {
      throw new AppError(400, `Erro de tipo: O valor para a chave única "${uniqueKey}" deve ser um ${typeof value}.`);
    }

    const result = await this.findOne(validatedFilter);
    if (!result) {
      throw new AppError(404, 'Nenhum documento encontrado para o filtro fornecido.');
    }
    return result;
  };

  /**
   * Atualiza um documento com base em uma chave única.
   *
   * @param {Object} filter - Filtro contendo a chave única e seu valor.
   * @param {Object} updateFields - Campos a serem atualizados.
   * @param {Object} [options={}] - Opções adicionais para a operação.
   * @param {boolean} [options.new=true] - Retorna o documento atualizado (se `true`) ou original (se `false`).
   * @returns {Promise<mongoose.Document|null>} - Documento atualizado ou `null` se nenhum for encontrado.
   * @throws {Error} Lança erro se o filtro for inválido ou a chave única for alterada.
   */
  newSchema.statics.findByUniqueKeyAndUpdate = async function (filter, updateFields, options = { new: true }) {
    const validatedFilter = ensureValidFilter(filter);
    if (Object.keys(validatedFilter).length === 0) {
      throw new Error('O filtro da chave única é obrigatório e não pode estar vazio.');
    }

    const uniqueKey = Object.keys(validatedFilter)[0];

    if (updateFields[uniqueKey] !== undefined && updateFields[uniqueKey] !== validatedFilter[uniqueKey]) {
      throw new Error(`O campo único "${uniqueKey}" não pode ser modificado.`);
    }

    return this.findOneAndUpdate(validatedFilter, updateFields, { ...options, runValidators: true });
  };

  return newSchema;
};

export default uniqueKeyPlugin;
