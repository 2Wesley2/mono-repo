'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  Typography,
  Snackbar,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { CustomerService } from '../../service/index';
import DataTable from '../../components/customer/DataTable';
import Title from '../../components/global/Title';

const EMPTY_CUSTOMER = { name: '', cpf: '', phone: '', email: '' };

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState(EMPTY_CUSTOMER);
  const [dialogState, setDialogState] = useState({
    type: null,
    customer: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { getAll, deleteCustomer, register, updateCustomer } = CustomerService;

  const loadCustomers = useCallback(async () => {
    try {
      const response = await getAll();
      console.log('Clientes recebidos do backend:', response);
      const customerList = response.customers.map((customer) => ({
        _id: customer._id,
        name: customer.name,
        cpf: customer.cpf,
        email: customer.email,
        phone: customer.phone,
        cashback: customer.rewards.cash,
        lifetimeValue: customer.lifetimeValue,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      }));

      setCustomers(customerList);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleOpenDialog = (type, customer = null) => {
    setDialogState({ type, customer });
    setNewCustomer(
      type === 'add' ? EMPTY_CUSTOMER : customer || EMPTY_CUSTOMER,
    );
  };

  const handleCloseDialog = useCallback(() => {
    setDialogState({ type: null, customer: null });
    setFormErrors({});
  }, []);

  const handleSnackbarOpen = () => setSnackbarOpen(true);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const validateForm = useCallback(() => {
    const errors = {};
    if (!newCustomer.name)
      errors.name = { error: true, message: 'Nome é obrigatório' };
    if (!newCustomer.cpf)
      errors.cpf = { error: true, message: 'CPF é obrigatório' };
    if (!newCustomer.phone)
      errors.phone = { error: true, message: 'WhatsApp é obrigatório' };
    if (newCustomer.email && !/\S+@\S+\.\S+/.test(newCustomer.email)) {
      errors.email = { error: true, message: 'Email inválido' };
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [newCustomer]);

  const handleAddCustomer = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const addedCustomer = await register(newCustomer);
      setCustomers((prev) => [...prev, addedCustomer]);
      handleCloseDialog();
      handleSnackbarOpen();
    } catch (error) {
      console.error('Erro ao registrar cliente:', error);
    }
  }, [newCustomer, validateForm]);

  const handleEditCustomer = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const updatedCustomer = await updateCustomer(
        dialogState.customer._id,
        newCustomer,
      );
      setCustomers((prev) =>
        prev.map((cust) =>
          cust._id === updatedCustomer._id ? updatedCustomer : cust,
        ),
      );
      handleCloseDialog();
      handleSnackbarOpen();
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
    }
  }, [newCustomer, dialogState.customer, validateForm]);

  const handleDeleteCustomer = async (customerToDelete) => {
    try {
      console.log(`Tentando excluir cliente com ID: ${customerToDelete._id}`);
      await deleteCustomer(customerToDelete._id);

      setCustomers((prev) =>
        prev.filter((cust) => cust._id !== customerToDelete._id),
      );

      console.log(
        `Cliente com ID ${customerToDelete._id} removido da lista local.`,
      );
      handleSnackbarOpen();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente. Tente novamente.');
    }
  };

  const handleSubmit = useCallback(() => {
    if (dialogState.type === 'add') {
      handleAddCustomer();
    } else {
      handleEditCustomer();
    }
  }, [dialogState.type, handleAddCustomer, handleEditCustomer]);

  const filteredCustomers = useMemo(() => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    console.log(
      'Lista de clientes filtrada:',
      JSON.stringify(filtered, null, 2),
    );
    return filtered;
  }, [customers, searchQuery]);

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        my={3}
      >
        <Title>Gerenciamento de Clientes</Title>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog('add')}
          sx={{
            backgroundColor: '#E50914',
            color: '#FFFFF',
            '&:hover': { backgroundColor: '#b71c1c' },
            fontSize: 'large',
          }}
        >
          Registrar novo cliente
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" mb={3}>
        <TextField
          label="Pesquisar Cliente"
          variant="outlined"
          color="error"
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          sx={{ width: '300px' }}
          aria-label="Campo de pesquisa de clientes"
        />
      </Box>

      <Dialog
        open={dialogState.type !== null}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            {dialogState.type === 'add'
              ? 'Registrar Cliente'
              : 'Editar Cliente'}
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
              <Box
                component="form"
                onSubmit={(e) => e.preventDefault()}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <FormControl fullWidth>
                  <TextField
                    id="name"
                    label="Nome"
                    variant="outlined"
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                    error={formErrors.name?.error}
                    helperText={formErrors.name?.message}
                    fullWidth
                    required
                    color="error"
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    id="cpf"
                    label="CPF"
                    variant="outlined"
                    value={newCustomer.cpf}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, cpf: e.target.value })
                    }
                    error={formErrors.cpf?.error}
                    helperText={formErrors.cpf?.message}
                    fullWidth
                    required
                    color="error"
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                    error={formErrors.email?.error}
                    helperText={formErrors.email?.message}
                    fullWidth
                    color="error"
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    id="phone"
                    label="WhatsApp"
                    variant="outlined"
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                    error={formErrors.phone?.error}
                    helperText={formErrors.phone?.message}
                    fullWidth
                    required
                    color="error"
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
            size="large"
          >
            {dialogState.type === 'add'
              ? 'Registrar Cliente'
              : 'Salvar Alterações'}
          </Button>
          <Button
            onClick={handleCloseDialog}
            color="error"
            variant="contained"
            size="large"
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Ação realizada com sucesso!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {filteredCustomers.length === 0 ? (
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          Não há clientes cadastrados.
        </Typography>
      ) : (
        <DataTable
          headers={['Nome', 'CPF', 'Email', 'Telefone', 'Cashback']}
          dataKeys={['name', 'cpf', 'email', 'phone', 'cashback']}
          data={filteredCustomers}
          handleEdit={(customer) => handleOpenDialog('edit', customer)}
          handleDelete={handleDeleteCustomer}
        />
      )}
    </div>
  );
};

export default CustomerManagement;
