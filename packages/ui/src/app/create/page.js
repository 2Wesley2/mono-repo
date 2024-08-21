'use client';
import React from 'react';
import { Container } from '@mui/material';
import { ProductForm } from '../../modules/products/components/ProductForm';

export default function CreateProduct() {
  return (
    <Container>
      <ProductForm />
    </Container>
  );
}
