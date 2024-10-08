class CashbackService {
  constructor(cashbackRepository) {
    this.cashbackRepository = cashbackRepository;
  }

  async createCashback(data) {
    return this.cashbackRepository.create(data);
  }

  async findCashbacksByCustomer(customerId) {
    return this.cashbackRepository.findByCustomer(customerId);
  }

  async markCashbackAsUsed(cashbackId) {
    return this.cashbackRepository.markAsUsed(cashbackId);
  }
}

export default CashbackService;
