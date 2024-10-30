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

  async create(customerData) {
    try {
      const newCustomer = await this.model.create(customerData);
      await newCustomer.save();
      debug.logger.info('Novo cliente criado', { customerData });
      return newCustomer;
    } catch (error) {
      debug.logger.error('Erro ao criar novo cliente', { customerData, error });
      throw error;
    }
  }

  async findAll(filters = {}, options = {}) {
    try {
      return await this.model.find(filters, null, options);
    } catch (error) {
      throw new Error('Erro ao buscar clientes: ' + error.message);
    }
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
      const updatedCustomer = await this.model.findOneAndUpdate(
        { cpf },
        { $push: { tickets: ticketId } },
        { new: true },
      );

      if (!updatedCustomer) {
        throw new Error('Cliente não encontrado');
      }

      debug.logger.info('Ticket adicionado ao cliente', { cpf, ticketId });
      return updatedCustomer;
    } catch (error) {
      debug.logger.error('Erro ao adicionar ticket ao cliente', { cpf, ticketId, error });
      throw error;
    }
  }

  async getTicketsByCustomer(cpf) {
    try {
      debug.logger.info(`CustomerModel: Iniciando busca de cliente por ${cpf} no banco de dados`);

      const customer = await this.model.findOne({ cpf }).populate('tickets');
      if (!customer) {
        debug.logger.warn(`CustomerModel: ${customer} não encontrado no banco de dados`);
        return [];
      }

      debug.logger.info(`CustomerModel: ${customer} do cliente encontrados`, {
        cpf,
        ticketsCount: customer.tickets.length,
        tickets: customer.tickets,
      });

      return customer.tickets || [];
    } catch (error) {
      debug.logger.error('CustomerModel: Erro ao buscar tickets do cliente no banco de dados', { cpf, error });
      throw error;
    }
  }
}

export default CustomerModel;
