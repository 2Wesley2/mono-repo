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
  const [errorMessage, setErrorMessage] = useState('');
  const [isWaitingForProduct, setIsWaitingForProduct] = useState(false);

  useEffect(() => {
    const savedCommandNumber = localStorage.getItem('commandNumber');
    const savedIsWaitingForProduct =
      localStorage.getItem('isWaitingForProduct') === 'true';

    if (savedCommandNumber) {
      setActiveCommandNumber(savedCommandNumber);
      setIsWaitingForProduct(savedIsWaitingForProduct);
    }
  }, []);

  useEffect(() => {
    if (activeCommandNumber !== null) {
      localStorage.setItem('commandNumber', activeCommandNumber);
      localStorage.setItem('isWaitingForProduct', isWaitingForProduct);
    }
  }, [activeCommandNumber, isWaitingForProduct]);

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
    setErrorMessage('');
    setIsWaitingForProduct(false);
    localStorage.removeItem('commandNumber');
    localStorage.removeItem('isWaitingForProduct');
  };

  const handleAddProduct = useCallback(
    (product) => {
      console.log('activeCommandNumber:', activeCommandNumber);
      console.log('Produto clicado:', product);
      if (!activeCommandNumber) {
        console.warn('Nenhuma comanda ativa.');
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
          console.log('Produto já existente. Incrementando quantidade.');
          return prevOrder.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        console.log('Novo produto adicionado.');
        return [...prevOrder, { product, quantity: 1 }];
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

  const handleCommandNumberEnter = async (event) => {
    if (event.key !== 'Enter') return;

    const validation = validateCommandInput(commandNumber);

    if (validation === 'FINALIZE') {
      console.log('Finalizando comanda...');

      if (currentOrder.length > 0) {
        try {
          const orderData = {
            operation: 'add',
            products: currentOrder.map((item) => ({
              product: item.product._id,
              quantity: item.quantity,
            })),
          };

          await OrderService.modifyProduct(
            activeCommandNumber,
            'add',
            orderData.products,
          );
          console.log('Pedido criado com sucesso:', orderData);

          resetCommandState();
        } catch (error) {
          console.error('Erro ao criar pedido:', error.message);
          setErrorMessage('Erro ao finalizar comanda. Tente novamente.');
        }
      } else {
        console.warn('Não há produtos na comanda para finalizar.');
        setErrorMessage('Adicione produtos antes de finalizar a comanda.');
      }
    } else if (validation === 'VALID') {
      setActiveCommandNumber(commandNumber);
      setIsWaitingForProduct(true);
      console.log(`Comanda ${commandNumber} ativada.`);
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
