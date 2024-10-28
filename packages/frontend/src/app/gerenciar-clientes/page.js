"use client";
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { getCustomer, addCustomer, editCustomer, deleteCustomer } from '../../service/fetch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '' });
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  const loadCustomers = async () => {
    try {
      const customerList = await getCustomer();
      console.log('Clientes recebidos do backend:', customerList);
      setCustomers(customerList);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleAddCustomer = async () => {
    try {
      if (!newCustomer.name || !newCustomer.email) {
        console.error('Nome e email são obrigatórios');
        return;
      }

      if (editingCustomerId) {
        const updatedCustomer = await editCustomer(editingCustomerId, newCustomer);
        setCustomers(
          customers.map((cust) => (cust._id === editingCustomerId ? updatedCustomer : cust))
        );
        setEditingCustomerId(null);
      } else {
        const addedCustomer = await addCustomer(newCustomer);
        setCustomers([...customers, addedCustomer]);
      }

      setNewCustomer({ name: '', email: '' });
    } catch (error) {
      console.error('Erro ao registrar cliente:', error);
    }
  };

  const handleEditCustomer = (id) => {
    const customerToEdit = customers.find((cust) => cust._id === id);
    if (customerToEdit) {
      setNewCustomer({ name: customerToEdit.name, email: customerToEdit.email });
      setEditingCustomerId(id);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      console.log('Tentando excluir o cliente com ID:', id);
      await deleteCustomer(id);
      setCustomers(customers.filter((cust) => cust._id !== id));
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };


  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Clientes
      </Typography>
      {customers.length === 0 ? (
        <Typography variant="body1">Não há clientes cadastrados.</Typography>
      ) : (
        <List>
          {customers.map((customer) => {
            if (!customer._id) {
              console.error('Cliente sem _id encontrado:', customer);
              return null;
            }

            return (
              <ListItem key={customer._id} secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="editar" onClick={() => handleEditCustomer(customer._id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="excluir" onClick={() => handleDeleteCustomer(customer._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }>
                <ListItemText primary={customer.name} secondary={customer.email} />
              </ListItem>
            );
          })}
        </List>
      )}

      <Typography variant="h5" component="h2" gutterBottom>
        {editingCustomerId ? 'Editar Cliente' : 'Registrar Cliente'}
      </Typography>
      <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <TextField
          label="Nome"
          value={newCustomer.name}
          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={newCustomer.email}
          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleAddCustomer}>
          {editingCustomerId ? 'Salvar Alterações' : 'Registrar Cliente'}
        </Button>
      </Box>
    </Container>
  );
};

export default CustomerManagement;
