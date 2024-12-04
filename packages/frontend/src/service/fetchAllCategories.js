import { request } from './apiRequest.js';

const categories = ['Refeições', 'Geral', 'Bebidas', 'Salgados', 'Lanches'];

async function simplifyStructure(categorizedProducts) {
  const simplified = {};
  for (const [category, { success, data }] of Object.entries(
    categorizedProducts,
  )) {
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
    const resolve = await simplifyStructure(categorizedProducts);
    return resolve;
  } catch (err) {
    console.error('Erro ao buscar todas as categorias:', err);
    throw err;
  }
}

export default fetchAllCategories;
