import Database from '../../../database/index.js';
import mongoose from 'mongoose';
const Cashback = Database.registerModel({
  schema: {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'O ID do cliente é obrigatório'],
    },
    vouchersGenerated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',
      },
    ],
    lastUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  modelName: 'Cashback',
  options: {
    timestamps: true,
  },
});

class CashbackModel {
  // Adiciona um voucher gerado ao registro de cashback do cliente
  async addVoucher(customerId, voucherId) {
    try {
      const cashbackRecord = await Cashback.findOne({ customerId });

      if (cashbackRecord) {
        cashbackRecord.vouchersGenerated.push(voucherId);
        cashbackRecord.lastUpdate = Date.now();
        return await cashbackRecord.save();
      } else {
        const newCashback = new Cashback({
          customerId,
          vouchersGenerated: [voucherId],
        });
        return await newCashback.save();
      }
    } catch (error) {
      throw new Error('Erro ao registrar/atualizar o cashback: ' + error.message);
    }
  }

  // Busca os vouchers gerados para um cliente específico
  async getVouchersByCustomerId(customerId) {
    return Cashback.findOne({ customerId }).populate('vouchersGenerated');
  }

  // Resetar o histórico de cashback (geração de vouchers)
  async resetCashback(customerId) {
    return Cashback.findOneAndUpdate({ customerId }, { vouchersGenerated: [], lastUpdate: Date.now() });
  }
}

export default CashbackModel;
