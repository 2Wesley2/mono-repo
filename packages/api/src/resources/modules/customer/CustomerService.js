class CustomerService {
  constructor(customerRepository, cashbackRepository) {
    this.customerRepository = customerRepository;
    this.cashbackRepository = cashbackRepository;
  }

  async createCustomer(data) {
    return this.customerRepository.create(data);
  }

  async updateCustomer(id, data) {
    return this.customerRepository.update(id, data);
  }

  async deleteCustomer(id) {
    return this.customerRepository.delete(id);
  }

  async addCashbackToCustomer(customerId, amount) {
    if (amount <= 0) {
      throw new Error('O valor do cashback deve ser positivo');
    }

    await this.cashbackRepository.create({ customerId, amount });
    return this.customerRepository.findById(customerId);
  }

  async useCashbackFromCustomer(customerId, amount) {
    const customer = await this.customerRepository.findById(customerId);

    if (customer.cashbackBalance < amount) {
      throw new Error('Saldo de cashback insuficiente');
    }

    const availableCashbacks = await this.cashbackRepository.findByCustomer(customerId);

    let remainingAmount = amount;
    for (let cashback of availableCashbacks) {
      if (cashback.amount <= remainingAmount) {
        await this.cashbackRepository.markAsUsed(cashback._id);
        remainingAmount -= cashback.amount;
      } else {
        break;
      }
    }

    await this.customerRepository.update(customerId, { cashbackBalance: customer.cashbackBalance - amount });
    return this.customerRepository.findById(customerId);
  }
}

export default CustomerService;
