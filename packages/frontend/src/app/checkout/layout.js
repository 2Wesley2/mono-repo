import { Container, Paper } from '@mui/material';

export const metadata = {
  title: 'Checkout - Processo de Venda',
  description: 'Página de processo de venda com clientes e tickets',
};

const CheckoutLayout = ({ children }) => {
  return (
  <div className='layout'>
    <Paper sx={{ minHeight: '80vh' }}>
      <Container>
        {children}
      </Container>
    </Paper>
  </div>
  );
};

export default CheckoutLayout;
