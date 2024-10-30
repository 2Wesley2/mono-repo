import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, CircularProgress, Typography } from '@mui/material';
import { getAllCustomers } from '../service/index';

const CustomerSelection = ({ onSelectCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersData = await getAllCustomers();
        setCustomers(customersData);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <div>
      <Typography variant="h6">Selecione um Cliente</Typography>
      {customers.length === 0 ? (
        <Typography>Nenhum cliente encontrado.</Typography>
      ) : (
        <List>
          {customers.map((customer) => (
            <ListItem button key={customer.cpf} onClick={() => onSelectCustomer(customer)}>
              <ListItemText primary={`${customer.name} - CPF: ${customer.cpf}`} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default CustomerSelection;
