import Service from '../../core/Service.js';
import config from '../../../config/index.js';
class CustomerService extends Service {
  constructor(repository) {
    super(repository);
  }

  async findByCPF(cpf) {
    try {
      const customer = await this.repository.findByCPF(cpf);
      if (!customer) {
        throw new Error('Cliente não encontrado');
      }
      config.logger.info('Serviço: Cliente encontrado', { cpf });
      return customer;
    } catch (error) {
      config.logger.error('Serviço: Erro ao buscar cliente por CPF', { cpf, error });
      throw error;
    }
  }
}

export default CustomerService;
