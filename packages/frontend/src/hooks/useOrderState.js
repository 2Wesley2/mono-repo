import { useState, useEffect, useCallback } from 'react';
import { getProductsByCategories } from '../../service/product';
import OrderService from '@/service/order';

export const categories = ['Refeições', 'Geral', 'Bebidas', 'Salgados', 'Lanches'];

export const useOrderState = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [commandNumber, setCommandNumber] = useState('');
  const [activeCommandNumber, setActiveCommandNumber] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isWaitingForProduct, setIsWaitingForProduct] = useState(false);

  // Recuperar estado salvo no localStorage na montagem
  useEffect(() => {
    const savedCommandNumber = localStorage.getItem('commandNumber');
    const savedIsWaitingForProduct = localStorage.getItem('isWaitingForProduct') === 'true';

    if (savedCommandNumber) {
      setActiveCommandNumber(savedCommandNumber);
      setIsWaitingForProduct(savedIsWaitingForProduct);
    }
  }, []);

  // Salvar estado no localStorage quando necessário
  useEffect(() => {
    if (activeCommandNumber !== null) {
      localStorage.setItem('commandNumber', activeCommandNumber);
      localStorage.setItem('isWaitingForProduct', isWaitingForProduct);
    }
  }, [activeCommandNumber, isWaitingForProduct]);

  // Função para buscar produtos de uma categoria
  const fetchCategoryProducts = useCallback(async (category) => {
    if (categoryProducts[category]) return;

    setLoading(true);
    try {
      const response = await getProductsByCategories(category);
      setCategoryProducts((prevState) => ({
        ...prevState,
        [category]: response.data,
      }));
    } catch (error) {
      setErrorMessage(`Erro ao carregar produtos para a categoria "${category}".`);
    } finally {
      setLoading(false);
    }
  }, [categoryProducts]);

  const resetCommandState = () => {
    setCommandNumber('');
    setActiveCommandNumber(null);
    setCurrentOrder([]);
    setErrorMessage('');
    setIsWaitingForProduct(false);
    localStorage.removeItem('commandNumber');
    localStorage.removeItem('isWaitingForProduct');
  };

  const handleAddProduct = useCallback((product) => {
    if (!activeCommandNumber) {
      setErrorMessage('Defina um número de comanda antes de adicionar produtos.');
      return;
    }

    setCurrentOrder((prevOrder) => {
      const existingProduct = prevOrder.find((item) => item.product._id === product._id);
      if (existingProduct) {
        return prevOrder.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevOrder, { product, quantity: 1 }];
    });

    setErrorMessage('');
  }, [activeCommandNumber]);

  return {
    activeTab,
    setActiveTab,
    categories,
    fetchCategoryProducts,
    categoryProducts,
    loading,
    commandNumber,
    setCommandNumber,
    activeCommandNumber,
    isWaitingForProduct,
    setIsWaitingForProduct,
    currentOrder,
    errorMessage,
    resetCommandState,
    handleAddProduct,
  };
};
