import Database from '../../../database/index.js';

const Voucher = Database.registerModel({
  schema: {
    customerId: {
      type: Database.ObjectId,
      ref: 'Customer',
      required: [true, 'O ID do cliente é obrigatório'],
    },
    discountPercentage: {
      type: Number,
      min: [0, 'A porcentagem mínima é 0'],
      max: [100, 'A porcentagem máxima é 100'],
      validate: {
        validator: function (v) {
          // Verifica se ou discountPercentage ou voucherValue foi definido, mas não ambos
          return this.voucherValue === undefined || v === undefined;
        },
        message: 'O voucher deve ter um desconto em valor fixo ou percentual, mas não ambos.',
      },
    },
    // Valor fixo do voucher (usado para valores de R$ 50 até R$ 149)
    voucherValue: {
      type: Number,
      validate: {
        validator: function (v) {
          // Verifica se ou voucherValue ou discountPercentage foi definido, mas não ambos
          return this.discountPercentage === undefined || v === undefined;
        },
        message: 'O voucher deve ter um desconto em valor fixo ou percentual, mas não ambos.',
      },
    },
    validUntil: {
      type: Date,
      required: [true, 'A data de validade é obrigatória'],
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  modelName: 'Voucher',
  options: {
    timestamps: true,
  },
});

class VoucherModel {
  async findApplicableVoucher(customerId, amount) {
    try {
      const now = new Date();
      return await Voucher.findOne({
        customerId,
        isUsed: false,
        validUntil: { $gte: now },
      });
    } catch (error) {
      throw new Error('Erro ao buscar voucher aplicável: ' + error.message);
    }
  }

  async findById(voucherId) {
    try {
      return await Voucher.findById(voucherId);
    } catch (error) {
      throw new Error('Erro ao buscar voucher: ' + error.message);
    }
  }

  async markAsUsed(voucherId) {
    try {
      await Voucher.findByIdAndUpdate(voucherId, { isUsed: true }, { new: true });
    } catch (error) {
      throw new Error('Erro ao marcar o voucher como usado: ' + error.message);
    }
  }
}

export default VoucherModel;
