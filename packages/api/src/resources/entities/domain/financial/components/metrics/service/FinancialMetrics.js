export default class FinancialMetrics extends FinancialMetricsInterface {
  static calculateGrossRevenue(salesValues) {
    return math.sum(salesValues); // receita bruta
  }

  static calculateNetRevenue(totalRevenue, deductions) {
    return math.sub(totalRevenue, deductions); // Receita líquida = Receita total - Dedução
  }

  static calculateGrossMargin(totalRevenue, productsCostPrice) {
    const grossProfit = math.sub(totalRevenue, productsCostPrice); // Lucro bruto
    return math.pct(grossProfit, totalRevenue); // (Lucro bruto / Receita total) * 100
  }

  static calculateAverageTicket(totalRevenue, totalSales) {
    return math.div(totalRevenue, totalSales); // Receita média por venda
  }

  static calculateConversionRate(visitors, sales) {
    return math.pct(sales, visitors); // Taxa de conversão = (Vendas / Visitantes) * 100
  }

  static calculateNetProfit(netRevenue, totalExpenses) {
    return math.sub(netRevenue, totalExpenses); // Lucro líquido = Receita líquida - Despesas totais
  }

  static calculateROI(netProfit, investment) {
    return math.div(netProfit, investment); // ROI = Lucro líquido / Investimento
  }

  static calculatePercentageROI(netProfit, investment) {
    return math.pct(netProfit, investment); // ROI % = (Lucro líquido / Investimento) * 100
  }

  static calculateTotalGrossRevenue(salesValues, serviceValues) {
    const salesRevenue = this.calculateGrossRevenue(salesValues);
    const serviceRevenue = math.sum(serviceValues);
    return math.sum([salesRevenue, serviceRevenue]); // Receita bruta total
  }

  static calculateCMV(initialStock, purchases, finalStock) {
    return math.sub(math.sum([initialStock, purchases]), finalStock); // CMV = Estoque inicial + Compras - Estoque final
  }

  static calculateOperationalExpenses([expenses]) {
    return math.sum(expenses); // Soma todas as despesas operacionais
  }

  static calculatePreTaxProfit(grossRevenue, totalExpenses, financialResult) {
    const operationalResult = math.sub(grossRevenue, totalExpenses);
    return math.sum([operationalResult, financialResult]); // Lucro antes dos impostos
  }

  static calculateTaxProvisions(preTaxProfit, taxRate) {
    return math.pct(preTaxProfit, taxRate); // Provisões de imposto = (Lucro antes dos impostos * Taxa)
  }

  static calculateNetIncome(preTaxProfit, taxProvisions) {
    return math.sub(preTaxProfit, taxProvisions); // Lucro líquido
  }

  static calculateFinalNetIncome(netIncome, participations) {
    return math.sub(netIncome, participations); // Lucro líquido final
  }

  static calculateOperationalGrossRevenue(salesRevenue, serviceRevenue) {
    return math.sum([salesRevenue, serviceRevenue]); // Receita Operacional Bruta
  }

  static calculateDeductions([deductions]) {
    return math.sum(deductions); // Soma todas as deduções da receita bruta
  }

  static calculateOperationalNetRevenue(grossRevenue, deductions) {
    return math.sub(grossRevenue, deductions); // Receita Operacional Líquida
  }

  static calculateGrossProfit(netRevenue, costOfGoodsSold) {
    return math.sub(netRevenue, costOfGoodsSold); // Lucro Bruto = Receita líquida - CMV/CSP
  }

  static calculateOperationalResult(grossProfit, operationalExpenses) {
    return math.sub(grossProfit, operationalExpenses); // Resultado Operacional = Lucro Bruto - Despesas Operacionais
  }

  static calculateNonOperationalResult(revenues, expenses) {
    return math.sub(revenues, expenses); // Resultado Não Operacional = Receitas - Despesas Não Operacionais
  }

  static calculateBeforeTaxProfit(operationalResult, nonOperationalResult) {
    return math.sum([operationalResult, nonOperationalResult]); // Resultado Antes do IR e CSLL (LAIR)
  }

  static calculateParticipations(lair, participationsRate) {
    return math.pct(lair, participationsRate); // Participações (em % do LAIR)
  }
}
