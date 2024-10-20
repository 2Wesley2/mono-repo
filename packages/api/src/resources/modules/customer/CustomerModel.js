import Model from '../../core/Model.js';
import Database from '../../../database/index.js';
import debug from '../../../debug/index.js';
import { CUSTOMER, TICKET } from '../../constants/index.js';

const customerSchema = {
  name: { type: String, required: true },
  cpf: { type: String, unique: true, required: true },
  email: { type: String },
  phone: { type: String },
  tickets: [
    {
      type: Database.ObjectId,
      ref: TICKET,
    },
  ],
};

class CustomerModel extends Model {
  constructor() {
    super(customerSchema, CUSTOMER);
  }

  async findByCPF(cpf) {
    try {
      const customer = await this.model.findOne({ cpf });
      if (!customer) {
        debug.logger.warn('Cliente não encontrado', { cpf });
        return null;
      }
      debug.logger.info('Cliente encontrado', { cpf });
      return customer;
    } catch (error) {
      debug.logger.error('Erro ao buscar cliente por CPF', { cpf, error });
      throw error;
    }
  }
  async addTicket(cpf, ticketId) {
    try {
      const customer = await this.findByCPF(cpf);
      if (!customer) {
        throw new Error('Cliente não encontrado');
      }

      customer.tickets.push(ticketId);
      const updatedCustomer = await customer.save();

      debug.logger.info('Ticket adicionado ao cliente', { cpf, ticketId });
      return updatedCustomer;
    } catch (error) {
      debug.logger.error('Erro ao adicionar ticket ao cliente', { cpf, ticketId, error });
      throw error;
    }
  }
}

export default CustomerModel;
