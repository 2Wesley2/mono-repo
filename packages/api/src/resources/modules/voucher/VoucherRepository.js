class VoucherRepository {
  constructor(model) {
    this.model = model;
  }

  findApplicableVoucher(customerId, amount) {
    return this.model.findApplicableVoucher(customerId, amount);
  }

  findById(voucherId) {
    return this.model.findById(voucherId);
  }

  markAsUsed(voucherId) {
    return this.model.markAsUsed(voucherId);
  }

  create(voucherData) {
    return this.model.create(voucherData);
  }
}

export default VoucherRepository;
