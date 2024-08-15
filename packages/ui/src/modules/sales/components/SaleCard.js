import React, { Component } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

class SaleCard extends Component {
  render() {
    const { sale } = this.props;

    return (
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            Produto: {sale.productId.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quantidade: {sale.quantity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preço Total: {sale.totalPrice}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default SaleCard;
