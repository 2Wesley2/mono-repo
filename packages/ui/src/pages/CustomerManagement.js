import React, { useState, useEffect } from 'react';
import { getCustomers, addCustomer, editCustomer, deleteCustomer } from '../services/customerService';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: String, cpf: String, contact: String });

  const loadCustomers = async () => {
    try {
      const customerList = await getCustomers();
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
      const addedCustomer = await addCustomer(newCustomer);
      setCustomers([...customers, addedCustomer]);
      setNewCustomer({ name: String, cpf: String, contact: String });
    } catch (error) {
      console.error('Erro ao registrar cliente:', error);
    }
  };

  const handleEditCustomer = async (id) => {
    try {
      const updatedCustomer = await editCustomer(id, newCustomer);
      setCustomers(
        customers.map((cust) => (cust.id === id ? updatedCustomer : cust))
      );
      setNewCustomer({ name: String, cpf: String, contact: String });
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer(id);
      setCustomers(customers.filter((cust) => cust.id !== id));
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
          {customers.map((customer) => (
            <li key={customer.id}>
              {customer.name} - {customer.cpf} - {customer.contact}
              <button onClick={() => handleEditCustomer(customer.id)}>Editar</button>
              <button onClick={() => handleDeleteCustomer(customer.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}

      <h2>Registrar Cliente</h2>
      <input
        type="text"
        placeholder="Nome"
        value={newCustomer.name}
        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="CPF"
        value={newCustomer.cpf}
        onChange={(e) => setNewCustomer({ ...newCustomer, cpf: e.target.value })}
      />
      <input
        type="text"
        placeholder="Telefone ou Email"
        value={newCustomer.contact}
        onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })}
      />
      <button onClick={handleAddCustomer}>Registrar Cliente</button>
    </div>
  );
};

export default CustomerManagement;
