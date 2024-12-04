'use client';
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import {
  initializeProductsByCategories,
  initializeCurrentOrder,
} from '../helper';
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  clearLocalStorage,
} from '../utils/storageUtils';
import { isClient } from '../utils/isClient';
import { OrderService } from '../service';

const categories = ['Refeições', 'Geral', 'Bebidas', 'Salgados', 'Lanches'];
const OrderStateContext = createContext(null);

export const OrderStateProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [productsByCategories, setProductsByCategories] = useState(null);
  const [activeCategoryProducts, setActiveCategoryProducts] = useState([]);
  const [isWaitingForProducts, setIsWaitingForProducts] = useState(false); // Inicializamos como falso
  const [commandNumber, setCommandNumber] = useState('');
  const [activeCommandNumber, setActiveCommandNumber] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [initialOrder, setInitialOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (isClient()) {
      setIsWaitingForProducts(
        loadFromLocalStorage('isWaitingForProduct') === 'true',
      );
      setActiveCommandNumber(loadFromLocalStorage('activeCommandNumber'));
      setCurrentOrder(loadFromLocalStorage('currentOrder') || []);
    }
  }, []);

  useEffect(() => {
    if (isClient() && activeCommandNumber !== null) {
      saveToLocalStorage('activeCommandNumber', activeCommandNumber);
    }
  }, [activeCommandNumber]);

  useEffect(() => {
    if (productsByCategories) {
      const activeCategory = categories[activeTab];
      setActiveCategoryProducts(productsByCategories[activeCategory] || []);
    }
  }, [activeTab, productsByCategories]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await initializeProductsByCategories();
        if (!data.error) {
          setProductsByCategories(data);
          setActiveCategoryProducts(data[categories[activeTab]] || []);
        } else {
          setErrorMessage(data.error || 'Erro ao carregar produtos.');
        }
      } catch (error) {
        setErrorMessage('Erro desconhecido ao carregar produtos.');
        console.error(error);
      }
    }

    fetchProducts();
  }, []);

  const validateCommandInput = (input) => {
    const trimmedInput = input.trim().toUpperCase();
    return trimmedInput === 'X'
      ? 'FINALIZE'
      : /^\d+$/.test(trimmedInput)
        ? 'VALID'
        : 'INVALID';
  };

  const buildUpdateFields = (current, initial) =>
    current.products.map((product) => ({
      product: product._id,
      quantity: product.quantity,
    }));

  const resetCommandState = () => {
    setActiveCommandNumber(null);
    setCurrentOrder([]);
    setCurrentOrder(null);
    setInitialOrder(null);
    setIsWaitingForProducts(false);
    clearLocalStorage('currentOrder');
    clearLocalStorage('activeCommandNumber');
  };

  const handleCommandNumberEnter = async (event) => {
    if (event.key !== 'Enter') return;

    const validation = validateCommandInput(commandNumber);

    if (validation === 'FINALIZE') {
      if (!activeCommandNumber) {
        setErrorMessage('Nenhuma comanda ativa para finalizar.');
        return;
      }

      try {
        if (currentOrder && currentOrder.products.length > 0) {
          const updateFields = buildUpdateFields(currentOrder, initialOrder);
          console.log(updateFields);
          console.log(typeof updateFields);
          console.log(JSON.stringify(updateFields));

          setLoading(true);
          await OrderService.updateOrderContent(activeCommandNumber, {
            products: updateFields,
          });
        }
        resetCommandState();
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(
          error.message || 'Erro ao finalizar comanda. Tente novamente.',
        );
      } finally {
        setLoading(false);
      }
    } else if (validation === 'VALID') {
      setActiveCommandNumber(commandNumber);
      saveToLocalStorage('activeCommandNumber', commandNumber);
      setIsWaitingForProducts(true);
      setErrorMessage('');

      try {
        setLoading(true);
        const products = await initializeCurrentOrder(commandNumber);
        if (products.error) throw new Error(products.error);

        setCurrentOrder(products);
        setInitialOrder(products);
      } catch (error) {
        setCurrentOrder(null);
        setErrorMessage('Erro ao buscar produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage('Entrada inválida. Insira um número válido ou "X".');
    }

    setCommandNumber('');
  };

  return (
    <OrderStateContext.Provider
      value={{
        activeTab,
        setActiveTab,
        productsByCategories,
        setProductsByCategories,
        activeCategoryProducts,
        setActiveCategoryProducts,
        errorMessage,
        setErrorMessage,
        categories,
        activeCommandNumber,
        setActiveCommandNumber,
        currentOrder,
        inputRef,
        loading,
        handleCommandNumberEnter,
        setIsWaitingForProducts,
        isWaitingForProducts,
        setCommandNumber,
        setCurrentOrder,
      }}
    >
      {children}
    </OrderStateContext.Provider>
  );
};

export const useOrderState = () => {
  const context = useContext(OrderStateContext);
  if (!context) {
    throw new Error(
      'useOrderState deve ser usado dentro de um OrderStateProvider',
    );
  }
  return context;
};
