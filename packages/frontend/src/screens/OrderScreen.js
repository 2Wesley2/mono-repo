import { Box, Container, Typography } from '@mui/material';
import { OrderStateProvider } from '../context/useOrderState';
import {
  CommandInput,
  TableOrder,
  TabsOrder,
  ProductListForOrder,
  ErrorOrder,
  TotalAmount,
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
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box
            sx={{
              height: '60vh',
              maxHeight: '60vh',
              minWidth: '60%',
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
            className="AQUI"
            sx={{
              marginTop: '5%',
              maxHeight: '60vh',
              minWidth: '40%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <TotalAmount />
          </Box>
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
