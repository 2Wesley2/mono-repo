class CashbackRepository {
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  findByCustomer(customerId) {
    return this.model.findByCustomer(customerId);
  }

  markAsUsed(cashbackId) {
    return this.model.markAsUsed(cashbackId);
  }
}

export default CashbackRepository;
