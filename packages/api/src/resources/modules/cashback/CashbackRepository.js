class CashbackRepository {
  constructor(model) {
    this.model = model;
  }

  createOrUpdateCashback(customerId, voucherId) {
    return this.model.createOrUpdateCashback(customerId, voucherId);
  }

  getVouchersByCustomerId(customerId) {
    return this.model.getVouchersByCustomerId(customerId);
  }

  resetCashback(customerId) {
    return this.model.resetCashback(customerId);
  }
}

export default CashbackRepository;
