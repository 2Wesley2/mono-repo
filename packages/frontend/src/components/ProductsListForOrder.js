import React from 'react';
import { Paper, Box, CircularProgress, Typography } from '@mui/material';
import { useOrderState } from '../hooks/useOrderState';

const ProductListForOrder = () => {
  const { loading, products, currentCategory, handleAddProduct } =
    useOrderState();
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
      {loading ? (
        <CircularProgress />
      ) : products.length > 0 ? (
        products.map((product) => (
          <Paper
            key={product.barcode}
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => handleAddProduct(product)}
            aria-label={`Adicionar produto ${product.name}`}
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
          Nenhum produto encontrado para a categoria "{currentCategory}".
        </Typography>
      )}
    </Box>
  );
};
export default ProductListForOrder;
