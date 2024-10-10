class CustomerRepository {
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  findById(id) {
    return this.model.findById(id).populate('vouchers');
  }

  findAll(filters = {}, options = {}) {
    return this.model.findAll(filters, options).populate('vouchers');
  }

  update(id, data) {
    return this.model.update(id, data).populate('vouchers');
  }

  delete(id) {
    return this.model.delete(id);
  }

  count(filters) {
    return this.model.countDocuments(filters);
  }
}

export default CustomerRepository;
