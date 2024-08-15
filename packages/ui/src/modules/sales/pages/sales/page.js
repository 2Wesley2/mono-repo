import React, { Component } from 'react';
import { Container } from '@mui/material';
import SaleList from '../../components/SaleList';

class SalesPage extends Component {
  render() {
    return (
      <Container>
        <SaleList />
      </Container>
    );
  }
}

export default SalesPage;
