import math from '../../index.js';
export default class FinancialMetrics {
  // Receitas
  static calculateTotalRevenue(salesRevenue, serviceRevenue, otherRevenues = []) {
    const totalOtherRevenues = math.sum(otherRevenues);
    return math.sum([salesRevenue, serviceRevenue, totalOtherRevenues]); // Receita total = Vendas + Serviços + Outras Receitas
  }

  static calculateGrossRevenue(salesValues) {
    return math.sum(salesValues); // Receita bruta
  }

  static calculateNetRevenue(grossRevenue, deductions) {
    return math.sub(grossRevenue, deductions); // Receita líquida = Receita total - Dedução
  }

  static calculateOperationalGrossRevenue(salesRevenue, serviceRevenue) {
    return math.sum([salesRevenue, serviceRevenue]); // Receita operacional bruta
  }

  static calculateTotalGrossRevenue(salesValues, serviceValues) {
    const salesRevenue = this.calculateGrossRevenue(salesValues);
    const serviceRevenue = math.sum(serviceValues);
    return math.sum([salesRevenue, serviceRevenue]); // Receita bruta total
  }

  static calculateOperationalNetRevenue(grossRevenue, deductions) {
    return math.sub(grossRevenue, deductions); // Receita operacional líquida = Receita operacional bruta - Deduções
  }

  // Custos e Despesas
  static calculateCMV(initialCostPriceProductsStock, purchases, finalCostPriceProductsStock) {
    return math.sub(math.sum([initialCostPriceProductsStock, purchases]), finalCostPriceProductsStock); // CMV = Estoque inicial + Compras - Estoque final
  }

  static calculateOperationalExpenses([expenses]) {
    return math.sum(expenses); // Despesas operacionais = Soma de todas as despesas operacionais
  }

  static calculateDeductions([deductions]) {
    return math.sum(deductions); // Deduções = Soma de todas as deduções da receita bruta
  }

  // Lucros
  static calculateGrossProfit(netRevenue, cmv) {
    return math.sub(netRevenue, cmv); // Lucro Bruto
  }

  static calculateNetProfit(netRevenue, totalExpenses) {
    return math.sub(netRevenue, totalExpenses); // Lucro líquido = Receita líquida - Despesas totais
  }

  static calculatePreTaxProfit(grossRevenue, totalExpenses, financialResult) {
    const operationalResult = math.sub(grossRevenue, totalExpenses);
    return math.sum([operationalResult, financialResult]); // Lucro antes dos impostos = Resultado operacional + Resultado financeiro
  }

  static calculateNetIncome(preTaxProfit, taxProvisions) {
    return math.sub(preTaxProfit, taxProvisions); // Resultado líquido = Lucro antes dos impostos - Provisões de impostos
  }

  static calculateFinalNetIncome(netIncome, participations) {
    return math.sub(netIncome, participations); // Resultado líquido final = Resultado líquido - Participações
  }

  // Margens e Indicadores de Desempenho
  static calculateGrossMargin(grossProfit, netRevenue) {
    return math.pct(grossProfit, netRevenue); // Margem bruta
  }

  static calculateAverageTicket(grossRevenue, totalSales) {
    return math.div(grossRevenue, totalSales); // Ticket médio = Receita média por venda
  }

  static calculateConversionRate(visitors, sales) {
    return math.pct(sales, visitors); // Taxa de conversão = (Vendas / Visitantes) * 100
  }

  static calculateROI(netProfit, investment) {
    return math.div(netProfit, investment); // ROI = Lucro líquido / Investimento
  }

  static calculatePercentageROI(netProfit, investment) {
    return math.pct(netProfit, investment); // ROI percentual = (Lucro líquido / Investimento) * 100
  }

  // Resultados Operacionais e Não Operacionais
  static calculateOperationalResult(grossProfit, operationalExpenses) {
    return math.sub(grossProfit, operationalExpenses); // Resultado operacional = Lucro bruto - Despesas operacionais
  }

  static calculateNonOperationalResult(revenues, expenses) {
    return math.sub(revenues, expenses); // Resultado não operacional = Receitas - Despesas não operacionais
  }

  static calculateBeforeTaxProfit(operationalResult, nonOperationalResult) {
    return math.sum([operationalResult, nonOperationalResult]); // Resultado antes do IR e CSLL (LAIR) = Resultado operacional + Resultado não operacional
  }

  // Impostos e Provisões
  static calculateTaxProvisions(preTaxProfit, taxRate) {
    return math.pct(preTaxProfit, taxRate); // Provisões de impostos = Lucro antes dos impostos * Taxa
  }

  static calculateParticipations(lair, participationsRate) {
    return math.pct(lair, participationsRate); // Participações = LAIR * Taxa de participação
  }
}
