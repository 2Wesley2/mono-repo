class CalcRefService {
  constructor(repository) {
    this.repository = repository;
  }

  async getBaseValue() {
    const baseValue = await this.repository.getBaseValue();
    return baseValue;
  }

  async getMinimumRedeemAmount() {
    const minimumRedeemAmount = await this.repository.getMinimumRedeemAmount();
    return minimumRedeemAmount;
  }
}
export default CalcRefService;
