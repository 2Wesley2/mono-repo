import { updateProduct } from '../service/productService';

const promptAndUpdateField = ({ fieldName, currentValue, parseFn, validateFn }) => {
  const newValue = prompt(`Editar ${fieldName}:`, currentValue);
  const parsedValue = newValue !== null && newValue.trim() !== '' ? parseFn(newValue) : currentValue;
  return validateFn ? validateFn(parsedValue) : parsedValue;
};

export const handleEditProduct = async (product, onEdit) => {
  const updatedProductData = {
    name: promptAndUpdateField({
      fieldName: 'nome do produto',
      currentValue: product.name,
      parseFn: String,
    }),
    quantity: promptAndUpdateField({
      fieldName: 'quantidade do produto',
      currentValue: product.quantity,
      parseFn: (value) => parseInt(value, 10),
      validateFn: (value) => (value > 0 ? value : product.quantity),
    }),
    price: promptAndUpdateField({
      fieldName: 'preço do produto (em centavos)',
      currentValue: product.price,
      parseFn: (value) => parseFloat(value),
      validateFn: (value) => (value > 0 ? value : product.price),
    }),
  };

  if (
    updatedProductData.name !== product.name ||
    updatedProductData.quantity !== product.quantity ||
    updatedProductData.price !== product.price
  ) {
    try {
      const updatedProduct = await updateProduct(product._id, updatedProductData);
      onEdit(updatedProduct);
      console.log('Produto atualizado com sucesso:', updatedProduct);
    } catch (error) {
      console.error('Erro ao atualizar o produto:', error.message);
      alert('Ocorreu um erro ao atualizar o produto. Por favor, tente novamente.');
    }
  } else {
    console.log('Nenhuma alteração foi feita.');
  }
};
