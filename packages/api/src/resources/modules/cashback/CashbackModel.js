import Model from '#src/core/infrastructure/components/base/Model.js';
import { CASHBACK, OWNER, PRODUCT } from '#src/resources/collections/index.js';

const cashbackSchema = {
  ownerId: { type: Model.objectIdType, ref: OWNER, required: true },
  type: { type: String, enum: ['reward', 'monetary'], required: true },
  config: {
    creditOfConsumption: {
      enabled: { type: Boolean, default: false },
      generationCondition: {
        type: mongoose.Schema.Types.Mixed,
        required: function () {
          return this.config && this.config.creditOfConsumption && this.config.creditOfConsumption.enabled;
        },
        validate: {
          validator: function (value) {
            if (!this.config.creditOfConsumption.enabled) return true;
            if (typeof value === 'number') {
              return value > 0;
            }
            if (Array.isArray(value)) {
              if (value.length === 0) return false;
              return value.every((id) => Model.isValidObjectId(id));
            }

            return false;
          },
          message: (props) =>
            `O campo generationCondition deve ser um número positivo ou uma lista não vazia de ObjectId válidos referenciando a collection ${PRODUCT}.`,
        },
      },
      utilizationCondition: { type: String },
      creditValue: { type: Number, default: 0 },
    },
    conversion: {
      enabled: { type: Boolean, default: false },
      generationCondition: { type: String },
      conversionRate: { type: Number },
      minUnitsForConversion: { type: Number },
    },
    exclusiveBenefit: {
      enabled: { type: Boolean, default: false },
      generationCondition: { type: String },
      description: { type: String },
    },
    monetary: {
      enabled: { type: Boolean, default: false },
      generationCondition: { type: String },
      value: { type: Number, default: 0 },
    },
  },
};

export default class CashbackModel extends Model {
  constructor(schema = {}, modelName = CASHBACK, options = {}, middlewares = []) {
    const combinedSchema = { ...cashbackSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  isClientEligible(clientData, config) {
    throw new Error("Método abstrato 'isClientEligible' deve ser implementado pela classe derivada.");
  }
}
