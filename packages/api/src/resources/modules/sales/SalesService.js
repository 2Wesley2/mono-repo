import AppError from '../../../errors/AppError.js';
import { validateObjectId } from '../../../helpers/validationHelper.js';

class SaleService {
  constructor(saleRepository, cashbackService, customerService, voucherService) {
    this.saleRepository = saleRepository;
    this.cashbackService = cashbackService;
    this.customerService = customerService;
    this.voucherService = voucherService;
  }

  async createSale(saleData) {
    const { customerId, amount, voucherId } = saleData;

    // Validar o ID do cliente
    validateObjectId(customerId);

    // Verificar se o cliente existe
    const customer = await this.customerService.customerRepository.findById(customerId);
    if (!customer) {
      throw new AppError(404, 'Cliente não encontrado.');
    }

    let finalAmount = amount;
    let voucherUsed = null;
    let voucherDiscount = 0;

    // Verificar se um voucherId foi fornecido e aplicar o voucher, caso o cliente opte por usá-lo
    if (voucherId) {
      const voucher = await this.voucherService.applyVoucherToSale(customerId, amount, voucherId);
      finalAmount = voucher.finalAmount; // Desconto aplicado
      voucherUsed = voucherId;
      voucherDiscount = voucher.discountApplied; // Armazenar o valor do desconto aplicado
    }

    // Registra a venda com ou sem o desconto do voucher
    const sale = await this.saleRepository.create({
      ...saleData,
      finalAmount,
      voucherId: voucherUsed, // Pode ser null se o cliente não utilizar o voucher
      voucherDiscount, // Pode ser 0 se o voucher não for aplicado
    });

    // Gera um novo voucher baseado no valor da compra, se aplicável
    const newVoucher = await this.cashbackService.generateVoucherBasedOnAmount(customerId, finalAmount);

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
    validateObjectId(saleId);
    return this.saleRepository.findById(saleId);
  }

  async updateSale(saleId, saleData) {
    validateObjectId(saleId);
    return this.saleRepository.update(saleId, saleData);
  }

  async deleteSale(saleId) {
    validateObjectId(saleId);
    return this.saleRepository.delete(saleId);
  }
}

export default SaleService;
