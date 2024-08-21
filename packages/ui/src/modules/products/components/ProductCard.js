import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export const ProductCard = ({ product }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preço: {product.price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quantidade: {product.quantity}
        </Typography>
      </CardContent>
    </Card>
  );
};
