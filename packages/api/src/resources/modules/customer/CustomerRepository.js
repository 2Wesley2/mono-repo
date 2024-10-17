import Repository from '../../core/Repository.js';
import config from '../../../config/index.js';
class CustomerRepository extends Repository {
  constructor(model) {
    super(model);
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
