class CustomerService {
  constructor(customerRepository, cashbackRepository, voucherRepository) {
    this.customerRepository = customerRepository;
    this.cashbackRepository = cashbackRepository;
    this.voucherRepository = voucherRepository;
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

  async addVoucherToCustomer(customerId, voucherId) {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new Error('Cliente não encontrado.');
    }

    const voucher = await this.voucherRepository.findById(voucherId);
    if (!voucher) {
      throw new Error('Voucher não encontrado.');
    }

    customer.vouchers.push(voucher._id);
    await customer.save();

    return customer;
  }
}

export default CustomerService;
