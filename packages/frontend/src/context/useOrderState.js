import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from 'react';
import { getProductsByCategories } from '../service/product';
import OrderService from '../service/order';

const categories = ['Refeições', 'Geral', 'Bebidas', 'Salgados', 'Lanches'];

const OrderStateContext = createContext(null);

export const OrderStateProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [commandNumber, setCommandNumber] = useState('');
  const [activeCommandNumber, setActiveCommandNumber] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [initialOrder, setInitialOrder] = useState([]); // Armazena o estado inicial do pedido
  const [errorMessage, setErrorMessage] = useState('');
  const [isWaitingForProduct, setIsWaitingForProduct] = useState(false);

  // Restaurar estado salvo do localStorage
  useEffect(() => {
    const savedCommandNumber = localStorage.getItem('commandNumber');
    const savedIsWaitingForProduct =
      localStorage.getItem('isWaitingForProduct') === 'true';
    const savedOrder = localStorage.getItem('currentOrder');

    if (savedCommandNumber) {
      setActiveCommandNumber(savedCommandNumber);
      setIsWaitingForProduct(savedIsWaitingForProduct);

      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        setCurrentOrder(parsedOrder);
        setInitialOrder(parsedOrder); // Define também o estado inicial
      } else {
        fetchProductsByOrder(savedCommandNumber);
      }
    }
  }, []);

  // Salvar estado no localStorage
  useEffect(() => {
    if (activeCommandNumber !== null) {
      localStorage.setItem('commandNumber', activeCommandNumber);
      localStorage.setItem('isWaitingForProduct', isWaitingForProduct);
      localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
    }
  }, [activeCommandNumber, isWaitingForProduct, currentOrder]);

  // Limpar pedido ao remover comanda ativa
  useEffect(() => {
    if (!activeCommandNumber) {
      setCurrentOrder([]);
      setInitialOrder([]); // Limpa também o estado inicial
      localStorage.removeItem('currentOrder');
    }
  }, [activeCommandNumber]);

  // Buscar produtos para uma comanda específica
  const fetchProductsByOrder = useCallback(async (activeCommandNumber) => {
    try {
      setLoading(true);

      const productList =
        await OrderService.listProductsByOrder(activeCommandNumber);

      if (!productList || productList.length === 0) {
        setErrorMessage(
          `Nenhum produto encontrado para a comanda ${activeCommandNumber}.`,
        );
        setCurrentOrder([]);
        setInitialOrder([]); // Limpa também o estado inicial
        return [];
      }

      setCurrentOrder(productList);
      setInitialOrder(productList); // Armazena o estado inicial
      setErrorMessage('');
      return productList;
    } catch (error) {
      setErrorMessage(`Erro ao buscar produtos da comanda: ${error.message}`);
      setCurrentOrder([]);
      setInitialOrder([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar produtos para uma categoria
  const fetchCategoryProducts = useCallback(
    async (category) => {
      if (categoryProducts[category]) return;

      setLoading(true);
      try {
        const response = await getProductsByCategories(category);
        setCategoryProducts((prevState) => ({
          ...prevState,
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

  const currentCategory = categories[activeTab];
  useEffect(() => {
    fetchCategoryProducts(currentCategory);
  }, [activeTab, fetchCategoryProducts]);

  const products = useMemo(
    () => categoryProducts[currentCategory] || [],
    [currentCategory, categoryProducts],
  );

  const resetCommandState = () => {
    setCommandNumber('');
    setActiveCommandNumber(null);
    setCurrentOrder([]);
    setInitialOrder([]); // Limpa o estado inicial
    setErrorMessage('');
    setIsWaitingForProduct(false);
    localStorage.removeItem('commandNumber');
    localStorage.removeItem('isWaitingForProduct');
    localStorage.removeItem('currentOrder');
  };

  const handleAddProduct = useCallback(
    (product) => {
      if (!activeCommandNumber) {
        setErrorMessage(
          'Defina um número de comanda antes de adicionar produtos.',
        );
        return;
      }

      setCurrentOrder((prevOrder) => {
        const existingProduct = prevOrder.find(
          (item) => item.product._id === product._id,
        );

        if (existingProduct) {
          return prevOrder.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }

        return [
          ...prevOrder,
          { product: { ...product, price: product.price }, quantity: 1 },
        ];
      });

      setErrorMessage('');
    },
    [activeCommandNumber],
  );

  const validateCommandInput = (input) => {
    const trimmedInput = input.trim().toUpperCase();
    if (trimmedInput === 'X') return 'FINALIZE';
    if (/^\d+$/.test(trimmedInput)) return 'VALID';
    return 'INVALID';
  };

  const buildUpdateFields = (order, initialOrder) => {
    const initialOrderMap = new Map(
      initialOrder.map((item) => [item.product._id, item.quantity]),
    );

    return order
      .map((item) => {
        const initialQuantity = initialOrderMap.get(item.product._id) || 0;
        const quantityChange = item.quantity - initialQuantity;

        if (quantityChange !== 0) {
          return {
            product: item.product._id,
            quantity: quantityChange,
            price: item.product.price,
          };
        }

        return null;
      })
      .filter(Boolean);
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
        if (currentOrder.length === 0) {
          setErrorMessage('Adicione produtos antes de finalizar a comanda.');
          return;
        }

        const updateFields = buildUpdateFields(currentOrder, initialOrder);

        setLoading(true);
        await OrderService.updateOrderContent(activeCommandNumber, {
          updateFields,
        });

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
      setIsWaitingForProduct(true);
      setErrorMessage('');

      try {
        setLoading(true);
        const products = await fetchProductsByOrder(commandNumber);
        setCurrentOrder(products);
      } catch {
        setCurrentOrder([]);
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
        handleCommandNumberEnter,
        products,
        currentCategory,
        fetchProductsByOrder,
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
