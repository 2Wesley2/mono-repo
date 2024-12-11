class RewardService {
  constructor(repository, calcRef) {
    this.repository = repository;
    this.calcRef = calcRef;
  }

  async checkBalanceByCustomer(customerId) {
    return await this.repository.getCurrentCashByCustomerId(customerId);
  }

  async addCashAtCustomer(customerId, totalAmount) {
    const numberBase = await this.calcRef.getBaseValue();
    const cashWon = totalAmount * numberBase;
    const currentCash = await this.repository.getCurrentCashByCustomerId(customerId);
    const updatedCash = currentCash + cashWon;
    if (updatedCash < currentCash) {
      throw new Error(
        `Erro na soma: O saldo atualizado (${updatedCash}) não pode ser menor que o saldo atual (${currentCash}).`,
      );
    }
    return await this.repository.addCashAtCustomer(customerId, updatedCash);
  }

  async subtractCashAtCustomer(customerId, cashSpent) {
    const currentCash = await this.repository.getCurrentCashByCustomerId(customerId);
    const minimumRedeemAmount = await this.calcRef.getMinimumRedeemAmount();

    if (currentCash < minimumRedeemAmount) {
      throw new Error(
        `É necessário um saldo mínimo para resgate. Saldo atual: ${currentCash}, saldo mínimo necessário: ${minimumRedeemAmount} `,
      );
    }

    const updatedCash = currentCash - cashSpent;

    if (updatedCash < 0) {
      throw new Error(`Saldo insuficiente. Saldo atual:${currentCash} `);
    }
    if (updatedCash > currentCash) {
      throw new Error(
        `Erro na subtração: O saldo atualizado (${updatedCash}) não pode ser maior que o saldo atual (${currentCash}).`,
      );
    }
    return await this.repository.subtractCashAtCustomer(customerId, updatedCash);
  }
}

export default RewardService;
