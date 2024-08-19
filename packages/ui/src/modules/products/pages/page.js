import React from 'react';
import { Container } from '@mui/material';
import { ProductList } from '../components/ProductList';

export const ProductsPage = () => {
  console.log("ProductsPage render");
  return (
    <Container>
      <ProductList />
    </Container>
  );
};
