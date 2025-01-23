import Model from '../../../../core/infrastructure/database/components/base/Model.js';
import { EXPENSE } from '../../../collections/index.js';

const expenseCategories = ['Operational', 'Non-Operational'];
const operationalSubcategories = ['Administrative', 'Sales', 'Production', 'Logistics', 'Marketing'];
const nonOperationalSubcategories = ['Financial', 'Legal', 'Losses', 'Extraordinary'];

function getSubcategoryEnum(category) {
  if (category === 'Operational') return operationalSubcategories;
  if (category === 'Non-Operational') return nonOperationalSubcategories;
  return null;
}
const expenseTypes = ['Fixed', 'Variable'];
const expenseSchema = {
  name: {
    type: String,
    required: true,
  },
  amount: { type: Number, required: true },
  category: { type: String, enum: [...expenseCategories], required: true },
  subcategory: {
    type: String,
    enum: function () {
      return getSubcategoryEnum(this.category);
    },
    required: true,
  },
  expenseType: {
    type: String,
    enum: [...expenseTypes],
    required: true,
  },
};

export default class ExpenseModel extends Model {
  constructor() {
    super(expenseSchema, EXPENSE);
  }

  async createExpenses(expense) {
    return await this.model.create(expense);
  }

  async getAllExpensesByFilters({ name, category, subcategory, expenseType, startDate, endDate }) {
    const filter = {
      ...(name && { name: { $regex: name, $options: 'i' } }),
      ...(category && { category }),
      ...(subcategory && { subcategory }),
      ...(expenseType && { expenseType }),
      ...(startDate || endDate
        ? {
            createdAt: { ...(startDate && { $gte: new Date(startDate) }), ...(endDate && { $lte: new Date(endDate) }) },
          }
        : {}),
    };

    return this.model.find(filter);
  }
}
