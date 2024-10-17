import Service from '../../core/Service.js';
import config from '../../../config/index.js';
import { CUSTOMER } from '../../constants/index.js';

class CustomerService extends Service {
  constructor(repository) {
    super(repository, CUSTOMER);
  }

  async findByCPF(cpf) {
    try {
      const customer = await this.repository.findByCPF(cpf);
      if (!customer) {
        throw new Error(`${CUSTOMER} não encontrado`);
      }
      config.logger.info(`Serviço: ${CUSTOMER} encontrado`, { cpf });
      return customer;
    } catch (error) {
      config.logger.error(`Serviço: Erro ao buscar ${CUSTOMER} por CPF`, { cpf, error });
      throw error;
    }
  }
}

export default CustomerService;
