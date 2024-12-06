import { Box, Container } from '@mui/material';
import { OrderStateProvider } from '../context/useOrderState';
import {
  CommandInput,
  TableOrder,
  TabsOrder,
  ProductListForOrder,
  ErrorOrder,
  TotalAmount,
  SearchButton,
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
              height: '50vh',
              maxHeight: '50vh',
              width: '60%',
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
              height: '50vh',
              maxHeight: '50vh',
              width: '40%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              overflow: 'hidden',
              justifyContent: 'center',
            }}
          >
            <TotalAmount />
            <SearchButton />
          </Box>
        </Box>
        <Box
          sx={{
            height: '50vh',
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
