import React, { Component } from 'react';
import { Grid, Typography } from '@mui/material';
import { getAllSales } from '../service/salesService';
import SaleCard from './SaleCard';

class SaleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sales: [],
      error: null,
    };
  }

  async componentDidMount() {
    try {
      const sales = await getAllSales();
      this.setState({ sales });
    } catch (error) {
      this.setState({ error: 'Erro ao carregar as vendas' });
    }
  }

  render() {
    const { sales, error } = this.state;

    return (
      <div>
        <Typography variant="h4" gutterBottom>
          Lista de Vendas
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={4}>
          {sales.map((sale) => (
            <Grid item key={sale.id} xs={12} sm={6} md={4}>
              <SaleCard sale={sale} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default SaleList;
