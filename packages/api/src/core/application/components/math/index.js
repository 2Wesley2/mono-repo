import MathOperations from './interface/MathOperations.js';
export default {
  sum: (...args) => MathOperations.sumAllNumbersArray(...args),
  sub: (...args) => MathOperations.subtractOperation(...args),
  div: (...args) => MathOperations.divisionOperation(...args),
  x: (...args) => MathOperations.multiplicationOperation(...args),
  pct: (...args) => MathOperations.calculatePercentage(...args)
};
