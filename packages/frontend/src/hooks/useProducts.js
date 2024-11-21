import { useState, useCallback, useEffect } from 'react';
import { getProductsByCategories } from '../service/product';

const categories = ['Refeições', 'Geral', 'Bebidas', 'Salgados', 'Lanches'];

export const useProducts = (categories, activeTab) => {
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCategoryProducts = useCallback(
    async (category) => {
      if (categoryProducts[category]) return;

      setLoading(true);
      try {
        const response = await getProductsByCategories(category);
        setCategoryProducts((prev) => ({
          ...prev,
          [category]: response.data,
        }));
      } catch (error) {
        setErrorMessage(
          `Erro ao carregar produtos para a categoria "${category}".`,
        );
      } finally {
        setLoading(false);
      }
    },
    [categoryProducts],
  );

  useEffect(() => {
    const currentCategory = categories[activeTab];
    console.log(`Categoria ativa selecionada: ${currentCategory}`);
    fetchCategoryProducts(currentCategory);
  }, [activeTab, fetchCategoryProducts]);
  const products = categoryProducts[categories[activeTab]] || [];

  return {
    products,
    loading,
    errorMessage,
    fetchCategoryProducts,
  };
};
