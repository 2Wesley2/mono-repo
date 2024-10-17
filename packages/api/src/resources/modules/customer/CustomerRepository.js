import config from '../../../config/index.js';
class CustomerRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const result = await this.model.create(data);
      config.logger.info('Repositório: Cliente criado', { data: result });
      return result;
    } catch (error) {
      config.logger.error('Repositório: Erro ao criar cliente', { error });
      throw error;
    }
  }

  async findByCPF(cpf) {
    try {
      const customer = await this.model.findByCPF(cpf);
      config.logger.info('Repositório: Cliente encontrado', { cpf });
      return customer;
    } catch (error) {
      config.logger.error('Repositório: Erro ao buscar cliente por CPF', { cpf, error });
      throw error;
    }
  }
}

export default CustomerRepository;
