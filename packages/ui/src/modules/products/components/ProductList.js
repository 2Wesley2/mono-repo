import React, { Component } from 'react';
import { Grid, Typography } from '@mui/material';
import { getAllProducts } from '../service/productService';
import ProductCard from './ProductCard';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      error: null
    };
  }

  async componentDidMount() {
    try {
      const products = await getAllProducts();
      this.setState({ products });
    } catch (error) {
      this.setState({ error: 'Erro ao carregar os produtos' });
    }
  }

  render() {
    const { products, error } = this.state;

    return (
      <div>
        <Typography variant="h4" gutterBottom>
          Lista de Produtos
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={4}>
          {products.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default ProductList;
