import env from '../env/index';

const apiBaseUrl = env.apiBaseUrl;

/**
 * Fetches products by category from the API.
 * @param {string} category - The category to filter products by.
 * @returns {Promise<Object[]>} - The list of products in the specified category.
 */
async function getProductsByCategories(category) {
  try {
    const encodedCategory = encodeURIComponent(category); // Codificar categoria
    const response = await fetch(
      `${apiBaseUrl}/api/product/category/${encodedCategory}`,
    );

    if (!response.ok) {
      throw new Error(
        `Erro ao buscar produtos da categoria "${category}": ${await response.text()}`,
      );
    }

    const data = await response.json();
    console.log('Produtos encontrados:', data);
    return data;
  } catch (error) {
    console.error(
      `Erro ao buscar produtos para a categoria ${category}:`,
      error,
    );
    throw error;
  }
}

export { getProductsByCategories };
