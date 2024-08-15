import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

class ProductsLayout extends Component {
  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              Gestão de Produtos
            </Typography>
          </Toolbar>
        </AppBar>
        <Container>
          {this.props.children}
        </Container>
        <footer style={{ marginTop: '20px', textAlign: 'center' }}>
          © 2024 Minha Empresa
        </footer>
      </div>
    );
  }
}

export default ProductsLayout;
