import loaders from '#src/core/loaders/index.js';

export default class Cashback {
  static validateGenerationCondition(context) {
    if (!context.enabled) return true;
    const gen = context.generationCondition || {};
    const hasRanges = Array.isArray(gen.ranges) && gen.ranges.length > 0;
    const hasProducts = Array.isArray(gen.products) && gen.products.length > 0;
    return hasRanges || hasProducts;
  }

  static validateProductsArray(value) {
    return Array.isArray(value) && value.every((id) => loaders.mongoose.isValidObjectId(id));
  }

  static validateRewardConfiguration() {
    if (this.type !== 'reward') return true;
    const reward = this.config?.reward;
    return (
      (reward?.creditOfConsumption && reward.creditOfConsumption.enabled) ||
      (reward?.conversion && reward.conversion.enabled) ||
      (reward?.exclusiveBenefit && reward.exclusiveBenefit.enabled)
    );
  }

  static validateMonetaryConfiguration() {
    if (this.type !== 'monetary') return true;
    return this.config?.monetary?.enabled;
  }

  static validateRangeMaxGreaterThanMin(value) {
    return value > this.minValue;
  }

  static validateTemporalValidity(context) {
    const { expirationDate, usagePeriods } = context || {};
    if (expirationDate && Array.isArray(usagePeriods) && usagePeriods.length > 0) {
      return false;
    }
    return true;
  }

  static validateUsage(context) {
    const { mode, maxPercentage } = context;
    if (mode === 'integral' && maxPercentage !== 100) return false;
    if (mode === 'partial' && maxPercentage === 100) return false;
    return true;
  }

  // ─── MÉTODOS MIDDLEWARE ───

  /**
   * Middleware para validar a configuração de geração de crédito.
   */
  static rewardCreditGenerationMiddleware(next) {
    if (this.creditOfConsumption && this.creditOfConsumption.enabled) {
      if (!Cashback.validateGenerationCondition(this.creditOfConsumption)) {
        return next(new Error('When enabled, at least one range or product must be defined for credit generation.'));
      }
    }
    next();
  }

  /**
   * Middleware para validar a temporalidade da validade.
   */
  static rewardTemporalValidityMiddleware(next) {
    if (this.usageConditions && this.usageConditions.temporalValidity) {
      const { expirationDate, usagePeriods } = this.usageConditions.temporalValidity;
      if (expirationDate && Array.isArray(usagePeriods) && usagePeriods.length > 0) {
        return next(new Error('Either expirationDate or usagePeriods must be defined exclusively'));
      }
    }
    next();
  }

  /**
   * Middleware para validar a configuração do uso.
   */
  static rewardUsageMiddleware(next) {
    if (this.usageConditions && this.usageConditions.usage) {
      const { mode, maxPercentage } = this.usageConditions.usage;
      if (mode === 'integral' && maxPercentage !== 100) {
        return next(
          new Error(
            'If usage mode is "integral", maxPercentage must be 100; if "partial", maxPercentage cannot be 100.',
          ),
        );
      }
      if (mode === 'partial' && maxPercentage === 100) {
        return next(
          new Error(
            'If usage mode is "integral", maxPercentage must be 100; if "partial", maxPercentage cannot be 100.',
          ),
        );
      }
    }
    next();
  }

  /**
   * Middleware para validar a configuração geral do reward.
   */
  static rewardConfigurationMiddleware(next) {
    if (this.type === 'reward') {
      const reward = this.config && this.config.reward;
      if (
        !(
          (reward && reward.creditOfConsumption && reward.creditOfConsumption.enabled) ||
          (reward && reward.conversion && reward.conversion.enabled) ||
          (reward && reward.exclusiveBenefit && reward.exclusiveBenefit.enabled)
        )
      ) {
        return next(
          new Error(
            'For reward cashback, at least one configuration (Consumption Credit, Conversion or Exclusive Benefit) must be enabled.',
          ),
        );
      }
    }
    next();
  }
}
