class CashbackRepository {
  constructor(model) {
    this.model = model;
  }

  createOrUpdate(customerId, cashbackAmount) {
    return this.model.createOrUpdate(customerId, cashbackAmount);
  }

  getCashbackByCustomerId(customerId) {
    return this.model.getCashbackByCustomerId(customerId);
  }

  resetCashback(customerId) {
    return this.model.resetCashback(customerId);
  }
}

export default CashbackRepository;
