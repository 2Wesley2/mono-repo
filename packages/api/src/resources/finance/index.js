import MathOperations from './components/MathOperations.js';
import FinancialMetrics from './components/FinancialMetrics.js';

const mathOperations = new MathOperations();
export const financialMetrics = new FinancialMetrics(mathOperations);
