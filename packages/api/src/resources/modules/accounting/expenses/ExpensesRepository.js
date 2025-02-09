class ExpensesRepository {
  constructor(model) {
    this.model = model;
  }
  async aggregateExpensesValueByPeriod(startDate, endDate) {
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
      throw new Error("Invalid timestamp range. Ensure 'startDate' is before 'endDate'.");
    }
    const expenses = await this.model.getAllExpensesByFilters({
      startDate,
      endDate
    });
    const totalAmount = expenses.reduce((acc, expense) => acc + (expense.amount || 0), 0);
    return totalAmount;
  }
}
