import { useOrderState } from '../context/useOrderState';

function useHandleProductClick() {
  const { activeCommandNumber, setCurrentOrder } = useOrderState();

  const handleProductClick = (product) => {
    if (!activeCommandNumber) {
      console.error('Nenhuma comanda ativa.');
      return;
    }
    setCurrentOrder((prevOrder) => {
      const existingProductIndex = prevOrder.products.findIndex(
        (item) => item._id === product._id,
      );
      const updatedProducts =
        existingProductIndex >= 0
          ? [
              ...prevOrder.products.slice(0, existingProductIndex),
              {
                ...prevOrder.products[existingProductIndex],
                quantity: prevOrder.products[existingProductIndex].quantity + 1,
              },
              ...prevOrder.products.slice(existingProductIndex + 1),
            ]
          : [...prevOrder.products, { ...product, quantity: 1 }];

      const totalAmount = updatedProducts.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      return {
        ...prevOrder,
        products: updatedProducts,
        totalAmount,
      };
    });
  };

  return { handleProductClick };
}
export default useHandleProductClick;
