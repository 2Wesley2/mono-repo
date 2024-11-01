import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CustomerTable = ({ customers, handleOpenDialog, handleDeleteCustomer }) => (
  <TableContainer component={Paper} sx={{ marginTop: 3 }}>
    <Table aria-label="Tabela de Clientes">
      <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>CPF</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
          <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {customers.map((customer) => (
          <TableRow
            key={customer._id}
            sx={{
              '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
              '&:hover': { backgroundColor: 'action.selected' },
            }}
          >
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.cpf}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell align="center">
              <Tooltip title="Editar">
                <IconButton onClick={() => handleOpenDialog('edit', customer)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Excluir">
                <IconButton onClick={() => handleDeleteCustomer(customer)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default CustomerTable;
