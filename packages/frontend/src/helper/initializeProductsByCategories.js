import { validateCategoryObjects } from '../utils';
import { fetchAllCategories } from '../service/index';

const expectedKeys = [
  '_id',
  'name',
  'price',
  'type',
  'quantity',
  'category',
  'barcode',
  '__v',
  'createdAt',
  'updatedAt',
];

async function initializeProductsByCategories() {
  const hasValidLocalStorageData = localStorage.getItem('productsByCategories');
  if (hasValidLocalStorageData && hasValidLocalStorageData.length > 0) {
    try {
      const parsedData = JSON.parse(hasValidLocalStorageData);
      const isValid = validateCategoryObjects(parsedData, expectedKeys);
      if (!isValid) {
        localStorage.removeItem('productsByCategories');
        return { error: 'estrutura de dados corrompida' };
      }
      return parsedData;
    } catch (error) {
      localStorage.removeItem('productsByCategories');
      return { error: 'dados no localStorage inválidos' };
    }
  } else {
    try {
      const productsByCategories = await fetchAllCategories();
      if (!productsByCategories) {
        return { error: 'erro ao buscar categorias do endpoint' };
      }
      localStorage.setItem(
        'productsByCategories',
        JSON.stringify(productsByCategories),
      );

      return productsByCategories;
    } catch (error) {
      return { error: 'erro ao buscar categorias do endpoint' };
    }
  }
}

export default initializeProductsByCategories;
