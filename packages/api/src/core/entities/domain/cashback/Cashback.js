import loaders from '#src/core/loaders/index.js';

export default class Cashback {
  /**
   * Determina se o campo generationCondition é obrigatório.
   * Deve ser chamado no contexto do documento (this).
   *
   * @returns {boolean} - Retorna true se o campo é obrigatório; caso contrário, false.
   */
  static generationConditionRequired() {
    return this.config && this.config.creditOfConsumption && this.config.creditOfConsumption.enabled;
  }

  /**
   * Função de validação para o campo generationCondition.
   * Deve ser chamada no contexto do documento (this).
   *
   * @param {*} value - Valor a ser validado.
   * @returns {boolean} - True se o valor for válido; caso contrário, false.
   */
  static generationConditionValidator(value) {
    if (!this.config.creditOfConsumption.enabled) return true;
    // Se for número, deve ser maior que zero.
    if (typeof value === 'number') {
      return value > 0;
    }
    // Se for um array, deve conter pelo menos um item e cada item deve ser um ObjectId válido.
    if (Array.isArray(value)) {
      if (value.length === 0) return false;
      return value.every((id) => loaders.mongoose.isValidObjectId(id));
    }
    return false;
  }

  /**
   * Setter para o campo generationCondition.
   * Se for um array, converte cada item para Model.objectIdType.
   * Deve ser chamada no contexto do documento (this).
   *
   * @param {*} value - Valor a ser convertido.
   * @returns {*} - Retorna o valor convertido.
   */
  static generationConditionSetter(value) {
    if (Array.isArray(value)) {
      // Se for array, converte cada item para ObjectId.
      // Essa função 'castObjectId' deve garantir que o item esteja no formato correto.
      return value.map((item) => loaders.mongoose.toObjectId(item));
    }
    return value;
  }
}
