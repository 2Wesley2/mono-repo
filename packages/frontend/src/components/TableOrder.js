import {
  Paper,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@mui/material';
import { useOrderState } from '../context/useOrderState';

const TableOrder = () => {
  const { currentOrder } = useOrderState();
  return (
    <Box
      sx={{
        overflowY: 'auto',
        height: '100%',
        display: 'flex',
        alignSelf: 'flex-start',
        width: '50%',
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          padding: '0.7%',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          '& .MuiTableHead-root': {
            backgroundColor: '#f5f5f5',
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            fontFamily: 'Roboto, Arial, sans-serif',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            color: '#333',
          },
          '& .MuiTableBody-root .MuiTableCell-root': {
            fontFamily: 'Roboto, Arial, sans-serif',
            fontSize: '0.875rem',
            color: '#555',
          },
          '& .MuiTableRow-root:hover': {
            backgroundColor: '#f9f9f9',
            transition: 'background-color 0.3s ease',
          },
        }}
      >
        <Table padding="none">
          <TableHead>
            <TableRow>
              <TableCell>Nome do Produto</TableCell>
              <TableCell align="right">Preço</TableCell>
              <TableCell align="right">Quantidade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrder.map(({ product, quantity }) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">{product.price.toFixed(2)}</TableCell>
                <TableCell align="right">{quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default TableOrder;
