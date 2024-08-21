import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

export const ProductsLayout = ({ children }) => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Gestão de Produtos</Typography>
        </Toolbar>
      </AppBar>
      <Container>{children}</Container>
      <footer style={{ marginTop: '20px', textAlign: 'center' }}>© 2024 Minha Empresa</footer>
    </div>
  );
};
