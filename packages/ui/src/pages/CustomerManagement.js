import React, { useState, useEffect } from 'react';
import { getCustomers, addCustomer, editCustomer, deleteCustomer } from '../services/customerService';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '' });
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  const loadCustomers = async () => {
    try {
      const customerList = await getCustomers();
      console.log('Clientes recebidos do backend:', customerList); // Debugging
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
      console.log('Tentando excluir o cliente com ID:', id); // Adicione este log
      await deleteCustomer(id);
      setCustomers(customers.filter((cust) => cust._id !== id));
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };
  

  return (
    <div>
      <h1>Gerenciamento de Clientes</h1>
      {customers.length === 0 ? (
        <p>Não há clientes cadastrados.</p>
      ) : (
        <ul>
          {customers.map((customer) => {
            if (!customer._id) {
              console.error('Cliente sem _id encontrado:', customer);
              return null;
            }

            return (
              <li key={customer._id}>
                {customer.name} - {customer.email}
                <button onClick={() => handleEditCustomer(customer._id)}>Editar</button>
                <button onClick={() => handleDeleteCustomer(customer._id)}>Excluir</button>
              </li>
            );
          })}
        </ul>
      )}

      <h2>{editingCustomerId ? 'Editar Cliente' : 'Registrar Cliente'}</h2>
      <input
        type="text"
        placeholder="Nome"
        value={newCustomer.name}
        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={newCustomer.email}
        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
      />
      <button onClick={handleAddCustomer}>
        {editingCustomerId ? 'Salvar Alterações' : 'Registrar Cliente'}
      </button>
    </div>
  );
};

export default CustomerManagement;
