import Model from '#src/core/infrastructure/components/base/Model.js';
import { CASHBACK, OWNER } from '#src/resources/collections/index.js';

const cashbackSchema = {
  ownerId: { type: Model.objectIdType, ref: OWNER, required: true },
  type: { type: String, enum: ['reward', 'monetary'], required: true },
  config: {
    reward: {},
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
