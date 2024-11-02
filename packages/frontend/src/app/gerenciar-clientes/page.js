"use client";
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card, Stack,
  Button,
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField,
  FormControl,
  Typography,
  Snackbar
} from '@mui/material';
import { getAllCustomers, addCustomer, editCustomer, deleteCustomer } from '../../service/index';
import DataTable from '../../components/DataTable';
import Title from '../../components/Title';

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
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
      handleSnackbarOpen();
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
      handleSnackbarOpen();
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
    }
  }, [newCustomer, dialogState.customer]);

  const handleDeleteCustomer = useCallback(async (customerToDelete) => {
    try {
      await deleteCustomer(customerToDelete._id);
      setCustomers((prev) => prev.filter((cust) => cust._id !== customerToDelete._id));
      handleSnackbarOpen();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  }, []);

  const handleSubmit = () => dialogState.type === 'add'
    ? handleAddCustomer()
    : handleEditCustomer();

  return (
    <div>
      <Box display="flex" alignItems="center" justifyContent="space-between" my={3}>
        <Title >
          Gerenciamento de Clientes
        </Title>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog('add')}
          sx={{
            backgroundColor: '#E50914',
            color: '#FFFFF',
            '&:hover': { backgroundColor: '#b71c1c' },
            fontSize: 'large'
          }}
        >
          Registrar novo cliente
        </Button>
      </Box>


      <Dialog
        open={dialogState.type !== null}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {dialogState.type === 'add' ? 'Registrar Cliente' : 'Editar Cliente'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack
            direction="column"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ padding: { xs: 2, sm: 4 } }}
          >
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                padding: 4,
                gap: 3,
                margin: 'auto',
                maxWidth: { sm: '500px' },
                boxShadow: 3,
              }}
            >
              <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <TextField
                    id="name"
                    label="Nome"
                    variant="outlined"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    error={formErrors.name?.error}
                    helperText={formErrors.name?.message}
                    fullWidth
                    required
                    color='error'
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    id="cpf"
                    label="CPF"
                    variant="outlined"
                    value={newCustomer.cpf}
                    onChange={(e) => setNewCustomer({ ...newCustomer, cpf: e.target.value })}
                    error={formErrors.cpf?.error}
                    helperText={formErrors.cpf?.message}
                    fullWidth
                    required
                    color='error'
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    error={formErrors.email?.error}
                    helperText={formErrors.email?.message}
                    fullWidth
                    color='error'
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    id="phone"
                    label="WhatsApp"
                    variant="outlined"
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    error={formErrors.phone?.error}
                    helperText={formErrors.phone?.message}
                    fullWidth
                    required
                    color='error'
                  />
                </FormControl>
              </Box>
            </Card>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-around', padding: 2 }}>
          <Button
            onClick={handleSubmit}
            color="success"

            variant="contained"
            size='large'>
            {dialogState.type === 'add' ? 'Registrar Cliente' : 'Salvar Alterações'}
          </Button>
          <Button
            onClick={handleCloseDialog}
            color="error"
            variant="contained"

            size='large'>
            Cancelar
          </Button>
        </DialogActions>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message="Ação realizada com sucesso!"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Dialog>

      {customers.length === 0 ? (
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{
            fontStyle: 'italic',
            textAlign: 'center',

          }}>
          Não há clientes cadastrados.
        </Typography>

      ) : (
        <DataTable
          headers={['Nome', 'CPF', 'Email', 'Telefone']}
          dataKeys={['name', 'cpf', 'email', 'phone']}
          data={customers}
          handleEdit={(customer) => handleOpenDialog('edit', customer)}
          handleDelete={handleDeleteCustomer}
        />
      )}
    </div>
  );
};

export default CustomerManagement;
