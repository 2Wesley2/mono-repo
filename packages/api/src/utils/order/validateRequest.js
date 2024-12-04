import AppError from '../../errors/AppError.js';
const badRequestNumberStatus = 400;

function validateRequest(type, input) {
  switch (type) {
    case 'orderNumber':
      const orderNumber = parseInt(input, 10);
      if (isNaN(orderNumber)) {
        throw new AppError(badRequestNumberStatus, 'Invalid orderNumber. Must be a number.');
      }
      return orderNumber;

    case 'products':
      if (!input || !Array.isArray(input) || input.length === 0) {
        throw new AppError(badRequestNumberStatus, 'products array is required and cannot be empty');
      }
      for (const { product, quantity, ...rest } of input) {
        if (!product || typeof product !== 'string') {
          throw new AppError(badRequestNumberStatus, 'Each products item must have a valid product string.');
        }
        if (typeof quantity !== 'number') {
          throw new AppError(badRequestNumberStatus, 'Each products item must have a valid type number quantity.');
        }
        if (Object.keys(rest).length > 0) {
          throw new AppError(`Unexpected fields in products item: ${JSON.stringify(rest)}`);
        }
      }
      return true;

    default:
      throw new Error(`Unknown validation type: ${type}`);
  }
}
export default validateRequest;
