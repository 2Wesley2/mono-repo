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

      if (existingProductIndex >= 0) {
        // Incrementa a quantidade do produto existente
        const updatedProducts = [...prevOrder.products];
        updatedProducts[existingProductIndex].quantity += 1;

        return {
          ...prevOrder,
          products: updatedProducts,
        };
      } else {
        return {
          ...prevOrder,
          products: [...prevOrder.products, { ...product, quantity: 1 }],
        };
      }
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
