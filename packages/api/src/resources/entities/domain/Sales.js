class PosSales {}

class OnlineSales {}

class Sales {
  constructor({ pos, online }) {
    this.pos = pos;
    this.online = online;
  }

  async processPosSale(data) {
    const processedPosSale = await this.pos.processPosSale(data);
    return processedPosSale;
  }
  async processOnlineSale(data) {
    const processedOnlineSale = await this.online.processOnlineSale(data);
    return processedOnlineSale;
  }
}
