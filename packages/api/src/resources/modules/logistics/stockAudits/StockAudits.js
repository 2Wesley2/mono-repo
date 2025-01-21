import Model from '../../../../core/entities/system/base/Model.js';
import { STOCK_AUDITS, SALE, PURCHASE } from '../../../collections/index.js';

const typesEnum = {
  sale: SALE,
  purchase: PURCHASE,
};

const stockAuditsSchema = {
  type: { type: String, enum: Object.keys(typesEnum), required: true },
  origin: {
    type: {
      type: Model.objectIdType,
      required: true,
      ref: function () {
        return typesEnum[this.type] || null;
      },
    },
    amount: { type: Number, required: true },
  },
};

export default class StockAudits extends Model {
  constructor() {
    super(stockAuditsSchema, STOCK_AUDITS);
  }

  async getTypesByDate(date, type) {
    const { startDate, endDate } = date;
    const filter = {
      ...(type && { type: { $regex: type, $options: 'i' } }),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate && { $gte: new Date(startDate) }),
              ...(endDate && { $lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    return this.model.find(filter);
  }

  async agreggateStockValueAtDate(date) {
    const auditedStockAtDate = await this.getTypesByDate(date);
    const stockValeuAtDate = auditedStockAtDate.reduce((amount, doc) => {
      return amount + (doc.origin?.amount || 0);
    }, 0);
    return stockValeuAtDate;
  }

  async agreggatePurchasesValueByPeriod(startDate, endDate) {
    const date = {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    };
    const auditedPurchasesAtDate = await this.getTypesByDate({ ...date }, typesEnum.purchase);
    const purchaseValeuAtDate = auditedPurchasesAtDate.reduce((amount, doc) => {
      return amount + (doc.origin?.amount || 0);
    }, 0);
    return purchaseValeuAtDate;
  }
}
