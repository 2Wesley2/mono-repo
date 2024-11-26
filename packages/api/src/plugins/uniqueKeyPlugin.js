import debug from '../debug/index.js';
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
    debug.logger.debug(`Plugin: ensureValidFilter chamado com filtro: ${JSON.stringify(filter)}`);
    if (!filter || typeof filter !== 'object') {
      debug.logger.warn('Plugin: Filtro inválido fornecido. Convertendo para um objeto vazio.');
      return {};
    }
    return filter;
  };

  /**
   * Encontra um documento com base em uma chave única.
   *
   * @param {Object} filter - Filtro contendo a chave única e seu valor.
   * @returns {Promise<mongoose.Document|null>} - Documento encontrado ou `null` se nenhum for encontrado.
   */
  newSchema.statics.findByUniqueKey = async function (filter) {
    debug.logger.debug(`Plugin: findByUniqueKey chamado com filtro: ${JSON.stringify(filter)}`);
    const validatedFilter = ensureValidFilter(filter);
    if (Object.keys(validatedFilter).length === 0) {
      debug.logger.error('Plugin: Filtro da chave única vazio após validação');
      throw new Error('O filtro da chave única é obrigatório e não pode estar vazio.');
    }
    const result = await this.findOne(validatedFilter);
    debug.logger.debug(`Plugin: Resultado de findByUniqueKey: ${JSON.stringify(result)}`);
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
