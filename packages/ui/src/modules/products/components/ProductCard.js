import React, { Component } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

class ProductCard extends Component {
  render() {
    const { product } = this.props;

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
  }
}

export default ProductCard;
