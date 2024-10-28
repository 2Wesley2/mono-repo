import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Grid, Typography } from '@mui/material';

const SaleOptions = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Iniciar Processo de Venda</Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => navigate('/filtrar-clientes')}>
            Venda com Cashback
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={() => navigate('/registrar-venda')}>
            Venda sem Cashback
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SaleOptions;
