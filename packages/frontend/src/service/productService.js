import { request } from './apiRequest';

const ProductService = {
  getProductsByCategories: async (category) =>
    request(`/product/category/${encodeURIComponent(category)}`, 'GET'),

  search: async (query) => {
    console.log(`[Search] Query sent:`, { query });
    const response = await request(
      `/product/search?q=${encodeURIComponent(query)}`,
      'GET',
    );
    console.log(`[Search] Response received:`, response);
    return response;
  },
};

export default ProductService;
