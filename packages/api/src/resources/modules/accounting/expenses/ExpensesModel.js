import Model from '../../../../core/infrastructure/components/base/Model.js';
import { EXPENSE, OWNER } from '../../../collections/index.js';

const expenseCategories = ['Operational', 'Non-Operational'];
const operationalSubcategories = ['Administrative', 'Sales', 'Production', 'Logistics', 'Marketing'];
const nonOperationalSubcategories = ['Financial', 'Legal', 'Losses', 'Extraordinary'];
const expenseTypes = ['Fixed', 'Variable'];

function getSubcategoryEnum(category) {
  if (category === 'Operational') return operationalSubcategories;
  if (category === 'Non-Operational') return nonOperationalSubcategories;
  return [];
}

const expenseSchema = {
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: [...expenseCategories],
    required: true
  },
  subcategory: {
    type: String,
    enum: function () {
      return getSubcategoryEnum(this.category);
    },
    required: true
  },
  expenseType: {
    type: String,
    enum: [...expenseTypes],
    required: true
  },
  ownerID: {
    type: Model.objectIdType,
    ref: OWNER,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String
  },
  receipt: {
    type: String
  },
  recurring: {
    type: Boolean,
    default: false
  }
};

export default class ExpenseModel extends Model {
  constructor() {
    super(expenseSchema, EXPENSE);
  }

  async createExpenses(expense) {
    return await this.model.create(expense);
  }

  async getAllExpensesByFilters({
    name,
    category,
    subcategory,
    expenseType,
    ownerID,
    startDate,
    endDate,
    paymentMethod,
    recurring
  }) {
    const filter = {
      ...(name && { name: { $regex: name, $options: 'i' } }),
      ...(category && { category }),
      ...(subcategory && { subcategory }),
      ...(expenseType && { expenseType }),
      ...(ownerID && { ownerID }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { $gte: new Date(startDate) }),
              ...(endDate && { $lte: new Date(endDate) })
            }
          }
        : {}),
      ...(paymentMethod && { paymentMethod }),
      ...(recurring !== undefined && { recurring })
    };

    return this.model.find(filter);
  }
}
