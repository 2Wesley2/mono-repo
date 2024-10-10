class VoucherRepository {
  constructor(model) {
    this.model = model;
  }

  async findApplicableVoucher(customerId, amount) {
    try {
      return await this.model.findApplicableVoucher(customerId, amount);
    } catch (error) {
      throw new Error('Erro ao buscar voucher aplicável no repositório: ' + error.message);
    }
  }

  async findById(voucherId) {
    try {
      return await this.model.findById(voucherId);
    } catch (error) {
      throw new Error('Erro ao buscar voucher no repositório: ' + error.message);
    }
  }

  async markAsUsed(voucherId) {
    try {
      await this.model.markAsUsed(voucherId);
    } catch (error) {
      throw new Error('Erro ao marcar voucher como usado no repositório: ' + error.message);
    }
  }

  async create(voucherData) {
    try {
      return await this.model.create(voucherData);
    } catch (error) {
      throw new Error('Erro ao criar voucher no repositório: ' + error.message);
    }
  }
}

export default VoucherRepository;
