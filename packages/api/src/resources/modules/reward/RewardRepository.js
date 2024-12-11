// RewardRepository - versão refatorada
class RewardRepository {
  constructor(model) {
    this.model = model;
  }

  async getRewardByCustomerId(customerId) {
    return await this.model.getRewardByCustomerId(customerId);
  }

  async updateRewardByCustomerId(customerId, updatedData) {
    return await this.model.updateRewardByCustomerId(customerId, updatedData);
  }

  async addCashAtCustomer(customerId, updatedCash) {
    return await this.model.updateRewardByCustomerId(customerId, { cash: updatedCash });
  }

  async subtractCashAtCustomer(customerId, updatedCash) {
    return await this.model.updateRewardByCustomerId(customerId, { cash: updatedCash });
  }

  async getCurrentCashByCustomerId(customerId) {
    const reward = await this.model.getRewardByCustomerId(customerId);
    return reward.cash;
  }
}

export default RewardRepository;
