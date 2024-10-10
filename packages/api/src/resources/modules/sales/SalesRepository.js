class SaleRepository {
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  findById(id) {
    return this.model.findById(id).populate('voucherUsed');
  }

  findAll(filters = {}, options = {}) {
    return this.model.findAll(filters, options).populate('voucherUsed');
  }

  update(id, data) {
    return this.model.update(id, data).populate('voucherUsed');
  }

  delete(id) {
    return this.model.delete(id);
  }
}

export default SaleRepository;
