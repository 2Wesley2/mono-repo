'use client';
import { Paper, Box, Typography } from '@mui/material';
import { useOrderState } from '../../context/useOrderState';

const ProductListForOrder = () => {
  const { activeCategoryProducts, activeCommandNumber, setCurrentOrder } =
    useOrderState();

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

  if (!activeCategoryProducts.length) {
    return (
      <Typography variant="h6">
        Nenhum produto disponível nesta categoria.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        flex: '1 1 auto',
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 2,
        padding: '1%',
      }}
    >
      {activeCategoryProducts.length > 0 ? (
        activeCategoryProducts.map((product) => (
          <Paper
            key={product._id}
            onClick={() => handleProductClick(product)}
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            aria-label={`Adicionar produto`}
          >
            <Typography
              align="center"
              gutterBottom
              variant="body1"
              sx={{
                overflow: 'hidden',
                fontFamily: 'Roboto, Arial, sans-serif !important',
                fontWeight: 'normal',
              }}
            >
              {product.name}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="body1">
          Nenhum produto encontrado para a categoria.
        </Typography>
      )}
    </Box>
  );
};
export default ProductListForOrder;
