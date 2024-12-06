'use client';
import { Paper, Box, Typography } from '@mui/material';
import { useHandleProductClick } from '../../hooks';
import { useOrderState } from '../../context/useOrderState';

const ProductListForOrder = () => {
  const { activeCategoryProducts } = useOrderState();
  const { handleProductClick } = useHandleProductClick();

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
            elevation={7}
            key={product._id}
            onClick={() =>
              handleProductClick({
                ...product,
                product: product.name,
              })
            }
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: '8px',
              transitionProperty: 'transform, background-color, box-shadow',
              transitionDuration: '0.3s',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              transformBox: 'fill-box',
              WebkitTransitionProperty:
                'transform, background-color, box-shadow',
              WebkitTransitionDuration: '0.3s',
              WebkitTransitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              WebkitTransformBox: 'fill-box',
              '&:hover': {
                transform: 'scale(1.05)',
                WebkitTransform: 'scale(1.05)',
              },
              '&:focus': {
                outline: '3px solid #3f51b5',
                WebkitOutline: '3px solid #3f51b5',
              },
            }}
            aria-label={`Adicionar produto`}
          >
            <Typography
              align="center"
              gutterBottom
              variant="body1"
              sx={{
                overflow: 'hidden',
                fontFamily: 'inherit',
                fontWeight: 'bold',
                textDecorationLine: 'underline',
                cursor: 'pointer',
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
