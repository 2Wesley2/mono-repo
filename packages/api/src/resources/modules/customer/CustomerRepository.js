import Repository from '../../core/Repository.js';
import config from '../../../config/index.js';
import { CUSTOMER } from '../../constants/index.js';

class CustomerRepository extends Repository {
  constructor(model) {
    super(model, CUSTOMER);
  }

  async findByCPF(cpf) {
    try {
      const customer = await this.model.findByCPF(cpf);
      config.logger.info(`Repositório: ${CUSTOMER} encontrado`, { cpf });
      return customer;
    } catch (error) {
      config.logger.error(`Repositório: Erro ao buscar ${CUSTOMER} por CPF`, { cpf, error });
      throw error;
    }
  }

  async addTicketToCustomer(cpf, ticketId) {
    try {
      const result = await this.model.findOneAndUpdate({ cpf }, { $push: { tickets: ticketId } }, { new: true });
      config.logger.info(`Repositório: Ticket adicionado ao cliente ${CUSTOMER}`, { cpf, ticketId });
      return result;
    } catch (error) {
      config.logger.error(`Repositório: Erro ao adicionar ticket ao ${CUSTOMER}`, { cpf, ticketId, error });
      throw error;
    }
  }
}

export default CustomerRepository;
