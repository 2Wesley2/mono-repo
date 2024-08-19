import React from 'react';
import { Container } from '@mui/material';
import { ProductForm } from '../components/ProductForm';
import { ProductsLayout } from './layout';

export const ProductCreatePage = () => {
  return (
    <ProductsLayout>
      <Container>
        <ProductForm />
      </Container>
    </ProductsLayout>
  );
};
