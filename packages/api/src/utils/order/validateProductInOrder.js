import AppError from '@/errors/AppError';

function validateProductInOrder(productIndex) {
  if (productIndex === -1) {
    throw new AppError(404, 'Product not found in order');
  }
}
export default validateProductInOrder;
