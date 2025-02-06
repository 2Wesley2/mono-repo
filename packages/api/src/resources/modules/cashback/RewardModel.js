import CashbackModel from './CashbackModel.js';
import { PRODUCT, CASHBACK } from '#src/resources/collections/index.js';
import loaders from '#core/loaders/index.js';
import Cashback from '#src/core/entities/domain/cashback/Cashback.js';

const temporalValidityDefinition = {
  expirationDate: { type: Date, required: false },
  usagePeriods: {
    type: [
      {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
      },
    ],
    default: [],
    required: false,
  },
};

const temporalValiditySchema = loaders.mongoose.subSchema(temporalValidityDefinition);

const usageSchema = loaders.mongoose.subSchema({
  mode: { type: String, enum: ['partial', 'integral'], default: 'integral' },
  maxPercentage: { type: Number, default: 100 },
});

const rewardSchemaFields = {
  creditOfConsumption: {
    enabled: { type: Boolean, default: false },
    generationCondition: {
      ranges: {
        type: [
          {
            minValue: { type: Number, required: [true, 'Minimum value is required for the range.'] },
            maxValue: { type: Number, required: [true, 'Maximum value is required for the range.'] },
            creditValue: { type: Number, required: [true, 'Credit value is required for the range.'] },
          },
        ],
        default: [],
      },
      products: {
        type: [CashbackModel.objectIdType],
        ref: PRODUCT,
        required: false,
      },
    },
  },
  _validateRewardConfig: {
    type: Boolean,
    default: true,
  },
  usageConditions: {
    temporalValidity: { type: temporalValiditySchema },
    progressiveAccumulation: {
      enabled: { type: Boolean, default: false },
      maxBalance: { type: Number, required: false },
    },
    usage: usageSchema,
  },
};

const rewardMiddlewares = [
  { type: 'pre', event: 'validate', fn: Cashback.rewardCreditGenerationMiddleware },
  { type: 'pre', event: 'validate', fn: Cashback.rewardTemporalValidityMiddleware },
  { type: 'pre', event: 'validate', fn: Cashback.rewardUsageMiddleware },
  { type: 'pre', event: 'validate', fn: Cashback.rewardConfigurationMiddleware },
];

const rewardSubSchema = loaders.mongoose.subSchema(rewardSchemaFields, {}, rewardMiddlewares);

export default class RewardModel extends CashbackModel {
  constructor(schema = {}, modelName = CASHBACK, options = {}, middlewares = []) {
    const newSchema = {
      ...schema,
      config: {
        ...((schema && schema.config) || {}),
        reward: { type: rewardSubSchema, default: {} },
      },
    };

    super(newSchema, modelName, options, middlewares);
  }

  /**
   * Atualiza a configuração do cashback do tipo reward para um determinado owner.
   *
   * @param {String} ownerId - ID do proprietário do cashback.
   * @param {Object} configData - Dados que deverão ser atribuídos à configuração reward.
   * @returns {Promise<Object>} - Documento atualizado.
   * @throws {Error} - Caso nenhum documento seja encontrado ou ocorra algum erro na atualização.
   */
  async setConfig(ownerId, configData) {
    const doc = await this.model.findOne({ ownerId, type: 'reward' });
    if (!doc) {
      throw new Error(`Nenhum cashback reward encontrado para o ownerId ${ownerId}.`);
    }
    doc.set('config.reward', configData);
    doc.markModified('config.reward');
    return await doc.save();
  }
}
