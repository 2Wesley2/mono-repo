import AppError from '../../../errors/AppError.js';

class SaleService {
  constructor(saleRepository, cashbackService, customerService, voucherService) {
    this.saleRepository = saleRepository;
    this.cashbackService = cashbackService;
    this.customerService = customerService;
    this.voucherService = voucherService;
  }

  validateObjectId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'ID inválido.');
    }
  }

  async createSale(saleData) {
    const { customerId, amount, voucherId } = saleData;

    this.validateObjectId(customerId);

    // Verificar se o cliente existe
    const customer = await this.customerService.customerRepository.findById(customerId);
    if (!customer) {
      throw new AppError(404, 'Cliente não encontrado.');
    }

    let finalAmount = amount;
    let voucherUsed = null;

    // Verificar se um voucherId foi fornecido e aplicar o voucher
    if (voucherId) {
      const voucher = await this.voucherService.applyVoucherToSale(customerId, amount, voucherId);
      finalAmount = voucher.finalAmount; // Desconto aplicado
      voucherUsed = voucherId;
    }

    // Registra a venda
    const sale = await this.saleRepository.create({ ...saleData, finalAmount, voucherId: voucherUsed });

    // Gera voucher baseado no valor da compra, se aplicável
    const newVoucher = await this.cashbackService.generateVoucherBasedOnAmount(customerId, amount);

    return {
      sale,
      voucherUsed,
      newVoucher,
      finalAmount,
    };
  }

  async getAllSales(query) {
    return this.saleRepository.findAll(query);
  }

  async getSaleById(saleId) {
    this.validateObjectId(saleId);
    return this.saleRepository.findById(saleId);
  }

  async updateSale(saleId, saleData) {
    this.validateObjectId(saleId);
    return this.saleRepository.update(saleId, saleData);
  }

  async deleteSale(saleId) {
    this.validateObjectId(saleId);
    return this.saleRepository.delete(saleId);
  }
}

export default SaleService;
