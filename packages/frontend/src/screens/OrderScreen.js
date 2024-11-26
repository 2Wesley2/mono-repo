'use client';
import { Box, Container } from '@mui/material';
import { OrderStateProvider } from '../context/useOrderState';
import {
  CommandInput,
  TableOrder,
  TabsOrder,
  ProductListForOrder,
  ErrorOrder,
} from '../components';

const OrderScreen = () => {
  return (
    <OrderStateProvider>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#D2B48C',
        }}
      >
        <Box
          sx={{
            height: '60vh',
            maxHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '1%',
          }}
        >
          <CommandInput />
          <TableOrder />
        </Box>

        <Box
          sx={{
            height: '40vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TabsOrder />
          <ProductListForOrder />
          <ErrorOrder />
        </Box>
      </Container>
    </OrderStateProvider>
  );
};

export default OrderScreen;
