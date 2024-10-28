import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Typography, Grid } from '@mui/material';

const ChooseSaleType = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Escolher Tipo de Venda
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/escolher-voucher/${customerId}`)}
          >
            Venda com Cashback
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/checkout-venda/${customerId}`)}
          >
            Venda sem Cashback
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChooseSaleType;
