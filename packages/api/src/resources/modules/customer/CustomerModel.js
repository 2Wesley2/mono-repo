import Model from '../../core/Model.js';
import Database from '../../../database/index.js';
import config from '../../../config/index.js';

const customerSchema = {
  name: { type: String, required: true },
  cpf: { type: String, unique: true, required: true },
  email: { type: String },
  phone: { type: String },
  tickets: [
    {
      type: Database.ObjectId,
      ref: 'Ticket',
    },
  ],
};

class CustomerModel extends Model {
  constructor() {
    super(customerSchema, 'Customer');
  }

  async findByCPF(cpf) {
    try {
      const customer = await this.model.findOne({ cpf });
      if (!customer) {
        config.logger.warn('Cliente não encontrado', { cpf });
        return null;
      }
      config.logger.info('Cliente encontrado', { cpf });
      return customer;
    } catch (error) {
      config.logger.error('Erro ao buscar cliente por CPF', { cpf, error });
      throw error;
    }
  }
}

export default CustomerModel;
