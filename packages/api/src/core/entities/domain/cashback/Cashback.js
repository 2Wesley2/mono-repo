import loaders from '#src/core/loaders/index.js';

export default class Cashback {
  /**
   * Valida que se a funcionalidade de crédito de consumo estiver habilitada,
   * então ao menos uma das propriedades (ranges ou products) deve ser definida.
   * Caso alguma delas esteja definida, deve conter ao menos um item.
   *
   * @returns {boolean} - True se a condição for satisfeita, caso contrário false.
   */
  static validateGenerationCondition() {
    // Se a funcionalidade não estiver habilitada, a validação passa.
    if (!this.config.reward.creditOfConsumption.enabled) return true;

    const gen = this.config.reward.creditOfConsumption.generationCondition || {};
    const hasRanges = Array.isArray(gen.ranges) && gen.ranges.length > 0;
    const hasProducts = Array.isArray(gen.products) && gen.products.length > 0;

    // É obrigatório que pelo menos um esteja definido (ranges, products ou ambos)
    return hasRanges || hasProducts;
  }

  /**
   * Valida se o array de products é um array não vazio e todos os itens são ObjectId válidos.
   *
   * @param {*} value - Valor a ser validado.
   * @returns {boolean} - True se for válido, caso contrário false.
   */
  static validateProductsArray(value) {
    return Array.isArray(value) ? value.length > 0 && value.every((id) => loaders.mongoose.isValidObjectId(id)) : true;
  }

  /**
   * Valida que, para cashback do tipo reward, ao menos uma das configurações
   * (Crédito de Consumo, Conversão ou Benefício Exclusivo) esteja habilitada.
   *
   * @returns {boolean} - True se a configuração estiver correta; caso contrário, false.
   */
  static validateRewardConfiguration() {
    if (this.type !== 'reward') return true;
    const reward = this.config?.reward;
    return (
      (reward?.creditOfConsumption && reward.creditOfConsumption.enabled) ||
      (reward?.conversion && reward.conversion.enabled) ||
      (reward?.exclusiveBenefit && reward.exclusiveBenefit.enabled)
    );
  }

  /**
   * Valida que, para cashback do tipo monetary, a configuração esteja habilitada.
   *
   * @returns {boolean} - True se estiver habilitada; caso contrário, false.
   */
  static validateMonetaryConfiguration() {
    if (this.type !== 'monetary') return true;
    return this.config?.monetary?.enabled;
  }

  /**
   * Valida que o valor máximo da faixa seja maior que o valor mínimo.
   *
   * @param {*} value - Valor máximo da faixa.
   * @returns {boolean} - True se maxValue > minValue.
   */
  static validateRangeMaxGreaterThanMin(value) {
    // 'this' é o objeto da faixa, onde this.minValue está disponível.
    return value > this.minValue;
  }

  /**
   * Valida as condições de temporalidade:
   * Se expirationDate estiver definida (ou seja, for truthy), usagePeriods não deve conter nenhum período,
   * e vice-versa.
   *
   * @param {Object} temporalValidity - Objeto contendo expirationDate e usagePeriods.
   * @returns {boolean} - True se a condição for satisfeita; caso contrário, false.
   */
  static validateTemporalValidity(temporalValidity) {
    const { expirationDate, usagePeriods } = temporalValidity || {};
    // Se ambos estiverem definidos (expirationDate existe e usagePeriods possui ao menos um período), invalida.
    if (expirationDate && Array.isArray(usagePeriods) && usagePeriods.length > 0) {
      return false;
    }
    return true;
  }

  /**
   * Valida as condições de uso:
   * Se mode for 'integral', maxPercentage deve ser exatamente 100.
   * Se mode for 'partial', maxPercentage não pode ser 100.
   *
   * @param {Object} usage - Objeto contendo mode e maxPercentage.
   * @returns {boolean} - True se a condição for satisfeita; caso contrário, false.
   */
  static validateUsage(usage) {
    const { mode, maxPercentage } = usage || {};
    if (mode === 'integral' && maxPercentage !== 100) return false;
    if (mode === 'partial' && maxPercentage === 100) return false;
    return true;
  }
}
