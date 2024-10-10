import AppError from '../../../errors/AppError.js';
import { validateObjectId } from '../../../helpers/validationHelper.js';

class VoucherService {
  constructor(voucherRepository, customerRepository) {
    this.voucherRepository = voucherRepository;
    this.customerRepository = customerRepository;
  }

  // Aplicação do voucher na venda
  async applyVoucherToSale(customerId, saleAmount, voucherId) {
    validateObjectId(customerId);
    validateObjectId(voucherId);

    // Verificar se o cliente existe
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new AppError(404, 'Cliente não encontrado.');
    }

    // Verificar se o voucher existe e pertence ao cliente
    const voucher = await this.voucherRepository.findById(voucherId);
    if (!voucher || voucher.customerId.toString() !== customerId.toString()) {
      throw new AppError(404, 'Voucher não encontrado ou não pertence a este cliente.');
    }

    // Verificar se o voucher já foi usado ou está expirado
    const now = new Date();
    if (voucher.isUsed) {
      throw new AppError(400, 'Voucher já foi usado.');
    }
    if (voucher.validUntil < now) {
      throw new AppError(400, 'Voucher expirado.');
    }

    // Calcular o desconto, baseado em porcentagem ou valor fixo
    let discountAmount = 0;
    if (voucher.discountPercentage > 0) {
      discountAmount = (saleAmount * voucher.discountPercentage) / 100;
    } else if (voucher.voucherValue) {
      discountAmount = voucher.voucherValue;
    }

    const finalAmount = saleAmount - discountAmount;

    // Marcar o voucher como usado (chamando a função otimizada no repositório)
    await this.voucherRepository.markAsUsed(voucherId);

    return {
      finalAmount,
      discountApplied: discountAmount,
    };
  }

  // Método para criar voucher
  async createVoucher(customerId, discountPercentage, voucherValue, validUntil) {
    validateObjectId(customerId);

    return this.voucherRepository.create({
      customerId,
      discountPercentage,
      voucherValue,
      validUntil,
    });
  }
}

export default VoucherService;
