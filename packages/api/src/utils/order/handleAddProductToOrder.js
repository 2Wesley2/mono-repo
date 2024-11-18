import AppError from '../../errors/AppError.js';

function handleAddProductToOrder({ product, productData }) {
  if (product.type === 'ready_to_sell' && product.quantity < productData.quantity) {
    throw new AppError(
      400,
      `Insufficient stock for product "${product.name}". Available: ${product.quantity}, Required: ${productData.quantity}.`,
    );
  }
}

export default handleAddProductToOrder;
