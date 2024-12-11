class CalcRefRepository {
  constructor(model) {
    this.model = model;
  }

  async getBaseValue() {
    const baseValue = await this.model.getBaseValue();
    return baseValue;
  }

  async getMinimumRedeemAmount() {
    const minimumRedeemAmount = await this.model.getMinimumRedeemAmount();
    return minimumRedeemAmount;
  }
}
export default CalcRefRepository;
