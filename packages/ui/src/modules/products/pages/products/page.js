import React, { Component } from 'react';
import { Container } from '@mui/material';
import ProductList from '../../components/ProductList';

class ProductsPage extends Component {
  render() {
    return (
      <Container>
        <ProductList />
      </Container>
    );
  }
}

export default ProductsPage;
