import debug from '../../../debug/index.js';

class CustomerService {
  constructor(repository, rewardService) {
    this.repository = repository;
    this.rewardService = rewardService;
  }

  async createCustomer(customerData) {
    try {
      const newCustomer = await this.repository.createCustomer(customerData);
      const newReward = await this.rewardService.createReward(newCustomer._id);
      const updatedCustomer = await this.repository.updateCustomer(newCustomer._id, { rewards: newReward._id });
      debug.logger.info('Serviço: Novo Cliente criado com sucesso', { customerData, updatedCustomer });
      return updatedCustomer;
    } catch (error) {
      debug.logger.error('Serviço: Erro ao criar Cliente', { customerData, error });
      throw error;
    }
  }

  async updateCustomer(id, updateData) {
    try {
      const updatedCustomer = await this.repository.updateCustomer(id, updateData);
      debug.logger.info('Serviço: Cliente atualizado', { id, updateData });
      return updatedCustomer;
    } catch (error) {
      debug.logger.error('Serviço: Erro ao atualizar cliente', { id, error });
      throw error;
    }
  }

  async deleteCustomer(id) {
    try {
      const deletedCustomer = await this.repository.deleteCustomer(id);
      debug.logger.info('Serviço: Cliente deletado', { id });
      return deletedCustomer;
    } catch (error) {
      debug.logger.error('Serviço: Erro ao deletar cliente', { id, error });
      throw error;
    }
  }
  async listAllCustomers() {
    return await this.repository.listAllCustomers();
  }
  async getCustomerWithRewards(customerId) {
    try {
      const customer = await this.repository.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Cliente não encontrado');
      }

      const rewards = await this.rewardService.getRewardByCustomerId(customerId);
      return { customer, rewards };
    } catch (error) {
      debug.logger.error('Serviço: Erro ao buscar cliente e recompensas', { customerId, error });
      throw error;
    }
  }
}

export default CustomerService;
