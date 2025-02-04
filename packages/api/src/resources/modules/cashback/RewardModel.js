import CashbackModel from './CashbackModel.js';
import Cashback from '#src/core/entities/domain/cashback/Cashback.js';
import { PRODUCT, CASHBACK } from '#src/resources/collections/index.js';

const rewardSchemaFields = {
  creditOfConsumption: {
    enabled: { type: Boolean, default: false },
    generationCondition: {
      ranges: {
        type: [
          {
            minValue: {
              type: Number,
              required: [true, 'Minimum value is required for the range.'],
            },
            maxValue: {
              type: Number,
              required: [true, 'Maximum value is required for the range.'],
              validate: {
                validator: function (value) {
                  return Cashback.validateRangeMaxGreaterThanMin.call(this, value);
                },
                message: 'Maximum value must be greater than minimum value.',
              },
            },
            creditValue: {
              type: Number,
              required: [true, 'Credit value is required for the range.'],
            },
          },
        ],
        default: [],
        validate: {
          validator: function (value) {
            return Array.isArray(value) ? value.length >= 0 : true;
          },
        },
      },
      products: {
        type: [CashbackModel.objectIdType],
        ref: PRODUCT,
        required: false,
        validate: {
          validator: function (value) {
            return Cashback.validateProductsArray.call(this, value);
          },
          message: 'If defined, products must be a non-empty array of valid ObjectIds.',
        },
      },
      _validateGenerationCondition: {
        type: Boolean,
        default: true,
        validate: {
          validator: function () {
            return Cashback.validateGenerationCondition.call(this);
          },
          message: 'When enabled, at least one range or product must be defined for credit generation.',
        },
      },
    },
    _validateRewardConfig: {
      type: Boolean,
      default: true,
      validate: {
        validator: function () {
          return Cashback.validateRewardConfiguration.call(this);
        },
        message:
          'For reward cashback, at least one configuration (Consumption Credit, Conversion or Exclusive Benefit) must be enabled.',
      },
    },
  },
  usageConditions: {
    temporalValidity: {
      expirationDate: {
        type: Date,
        required: false,
      },
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
      validate: {
        validator: function (value) {
          return Cashback.validateTemporalValidity(value);
        },
        message: 'Either expirationDate or usagePeriods must be defined exclusively.',
      },
    },
    progressiveAccumulation: {
      enabled: { type: Boolean, default: false },
      maxBalance: { type: Number, required: false },
    },
    usage: {
      mode: { type: String, enum: ['partial', 'integral'], default: 'integral' },
      maxPercentage: { type: Number, default: 100 },
      validate: {
        validator: function (value) {
          return Cashback.validateUsage(this);
        },
        message: 'If usage mode is "integral", maxPercentage must be 100; if "partial", maxPercentage cannot be 100.',
      },
    },
  },
};

export default class RewardModel extends CashbackModel {
  constructor(schema = {}, modelName = CASHBACK, options = {}, middlewares = []) {
    const customReward = schema.config && schema.config.reward ? schema.config.reward : {};
    const rewardMerged = {
      ...rewardSchemaFields,
      ...customReward,
    };

    const newSchema = {
      ...schema,
      config: {
        ...((schema && schema.config) || {}),
        reward: rewardMerged,
      },
    };

    super(newSchema, modelName, options, middlewares);
  }
}
