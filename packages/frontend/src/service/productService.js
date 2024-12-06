import { request } from './apiRequest';

const ProductService = {
  getProductsByCategories: async (category) =>
    request(`/product/category/${encodeURIComponent(category)}`, 'GET'),
  
  search: async (query) =>
    request(`/products/search?q=${encodeURIComponent(query)}`, 'GET'),
};

export default ProductService;
