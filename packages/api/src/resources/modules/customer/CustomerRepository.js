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

  async delete(id) {
    const result = await this.model.delete(id);
    if (!result) {
      throw new Error(`Cliente com id ${id} não encontrado.`);
    }
    return result;
  }

  count(filters) {
    return this.model.countDocuments(filters);
  }
}

export default CustomerRepository;
