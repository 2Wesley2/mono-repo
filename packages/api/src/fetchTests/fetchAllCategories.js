import { request } from './apiRequest.js';
import debug from '../debug/index.js';
const categories = ['Refeições', 'Geral', 'Bebidas', 'Salgados', 'Lanches'];
async function simplifyStructure(categorizedProducts) {
  const simplified = {};
  for (const [category, { success, data }] of Object.entries(categorizedProducts)) {
    if (success) {
      simplified[category] = data;
    }
  }
  return simplified;
}

async function fetchAllCategories() {
  try {
    const categoryPromises = categories.map((category) =>
      request(`/api/product/category/${encodeURIComponent(category)}`, 'GET'),
    );
    const resolveCategoryPromises = await Promise.all(categoryPromises);
    const categorizedProducts = categories.reduce((acc, category, index) => {
      acc[category] = resolveCategoryPromises[index];
      return acc;
    }, {});
    return await simplifyStructure(categorizedProducts);
  } catch (err) {
    console.error('Erro ao buscar todas as categorias:', err);
    throw err;
  }
}

export { fetchAllCategories };

(async () => {
  try {
    const allProducts = await fetchAllCategories();
    debug.logger.superdebug('', allProducts);
  } catch (err) {
    console.error('Erro:', err);
  }
})();
