import AppError from '../../../errors/AppError.js';

class CashbackService {
  constructor(cashbackRepository, voucherRepository, customerRepository) {
    this.cashbackRepository = cashbackRepository;
    this.voucherRepository = voucherRepository;
    this.customerRepository = customerRepository;
  }

  validateObjectId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'ID inválido.');
    }
  }

  // Geração de voucher baseada no valor gasto
  async generateVoucherBasedOnAmount(customerId, amount) {
    this.validateObjectId(customerId);

    let voucherValue = 0;
    let discountPercentage = 0;

    if (amount >= 50 && amount < 100) {
      voucherValue = 5; // Voucher de R$ 5
    } else if (amount >= 100 && amount < 150) {
      voucherValue = 10; // Voucher de R$ 10
    } else if (amount >= 150) {
      discountPercentage = 10; // 10% de desconto
    }

    if (voucherValue || discountPercentage) {
      const voucher = await this.voucherRepository.create({
        customerId,
        discountPercentage,
        voucherValue,
        validUntil: this.generateExpiryDate(),
      });
      return voucher;
    }

    return null;
  }

  generateExpiryDate() {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 3);
    return expiryDate;
  }
}

export default CashbackService;
