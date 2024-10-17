import config from '../../../config/index.js';
class CustomerService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    try {
      const result = await this.repository.create(data);
      config.logger.info('Serviço: Cliente criado com sucesso', { data: result });
      return result;
    } catch (error) {
      config.logger.error('Serviço: Erro ao criar cliente', { error });
      throw error;
    }
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
