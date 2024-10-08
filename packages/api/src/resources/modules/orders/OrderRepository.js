class OrderRepository {
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  findById(id) {
    return this.model.findById(id);
  }

  findAll(filters = {}, options = {}) {
    return this.model.findAll(filters, options);
  }

  update(id, data) {
    return this.model.update(id, data);
  }

  delete(id) {
    return this.model.delete(id);
  }
}

export default OrderRepository;
