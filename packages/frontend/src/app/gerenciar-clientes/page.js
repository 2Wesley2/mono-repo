"use client";
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Box,
  Paper, Card, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Tooltip,
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField,
  FormControl,
  Typography,
} from '@mui/material';
import { getAllCustomers, addCustomer, editCustomer, deleteCustomer } from '../../service/index';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: ''
  });
  const [dialogState, setDialogState] = useState({ type: null, customer: null });
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const loadCustomers = async () => {
    try {
      const customerList = await getAllCustomers();
      console.log('Clientes recebidos do backend:', customerList);
      setCustomers(customerList);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleOpenDialog = (type, customer = null) => {
    setDialogState({ type, customer });
    setNewCustomer(customer || { name: '', cpf: '', phone: '', email: '' });
  };

  const handleCloseDialog = () => {
    setDialogState({ type: null, customer: null });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!newCustomer.name) errors.name = { error: true, message: 'Nome é obrigatório' };
    if (!newCustomer.cpf) errors.cpf = { error: true, message: 'CPF é obrigatório' };
    if (!newCustomer.phone) errors.phone = { error: true, message: 'WhatsApp é obrigatório' };
    if (newCustomer.email && !/\S+@\S+\.\S+/.test(newCustomer.email)) {
      errors.email = { error: true, message: 'Email inválido' };
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCustomer = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const addedCustomer = await addCustomer(newCustomer);
      setCustomers((prev) => [...prev, addedCustomer]);
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao registrar cliente:', error);
    }
  }, [newCustomer]);

  const handleEditCustomer = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const updatedCustomer = await editCustomer(dialogState.customer._id, newCustomer);
      setCustomers((prev) =>
        prev.map((cust) => (cust._id === updatedCustomer._id ? updatedCustomer : cust))
      );
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
    }
  }, [newCustomer, dialogState.customer]);

  const handleDeleteCustomer = useCallback(async (customerToDelete) => {
    try {
      await deleteCustomer(customerToDelete._id);
      setCustomers((prev) => prev.filter((cust) => cust._id !== customerToDelete._id));
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  }, []);

  const handleSubmit = () => {
    if (dialogState.type === 'add') {
      handleAddCustomer();
    } else if (dialogState.type === 'edit') {
      handleEditCustomer();
    }
  };

  return (
    <div className='layout'>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciamento de Clientes
        </Typography>

        <Button
          variant="contained"
          onClick={() => handleOpenDialog('add')}
          sx={{
            backgroundColor: '#E50914',
            color: '#FFFFF',
            fontSize: 'large'
          }}
        >
          Registrar novo cliente
        </Button>

        <Dialog open={dialogState.type !== null} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialogState.type === 'add' ? 'Registrar Cliente' : 'Editar Cliente'}
          </DialogTitle>
          <DialogContent>
            <Stack
              direction="column"
              justifyContent="space-between"
              sx={{ padding: { xs: 2, sm: 4 } }}
            >
              <Card
                variant="outlined"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: 'center',
                  width: '100%',
                  padding: 4,
                  gap: 2,
                  margin: 'auto',
                  maxWidth: { sm: '450px' },
                }}
              >
                <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                  <FormControl>
                    <TextField
                      id="name"
                      label="Nome"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      error={formErrors.name?.error}
                      helperText={formErrors.name?.message}
                      fullWidth
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <TextField
                      id="cpf"
                      label="CPF"
                      type="text"
                      value={newCustomer.cpf}
                      onChange={(e) => setNewCustomer({ ...newCustomer, cpf: e.target.value })}
                      error={formErrors.cpf?.error}
                      helperText={formErrors.cpf?.message}
                      fullWidth
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <TextField
                      id="email"
                      label="Email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      error={formErrors.email?.error}
                      helperText={formErrors.email?.message}
                      fullWidth
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <TextField
                      id="phone"
                      label="WhatsApp"
                      type="tel"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      error={formErrors.phone?.error}
                      helperText={formErrors.phone?.message}
                      fullWidth
                      required
                    />
                  </FormControl>
                </Box>
              </Card>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {dialogState.type === 'add' ? 'Registrar Cliente' : 'Salvar Alterações'}
            </Button>
          </DialogActions>
        </Dialog>

        {customers.length === 0 ? (
          <Typography variant="body1">Não há clientes cadastrados.</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table aria-label="Tabela de Clientes">
              <TableHead>
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
        )}
      </Container>
    </div>
  );
};

export default CustomerManagement;
