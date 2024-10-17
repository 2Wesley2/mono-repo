import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, List, ListItem, ListItemText } from '@mui/material';
import { getCustomers } from '../services/customerService';

const CustomerFilter = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getCustomers()
      .then((data) => setCustomers(data))
      .catch((error) => console.error(error));
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <TextField
        label="Buscar Cliente"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <List>
        {filteredCustomers.map((customer) => (
          <ListItem
            key={customer._id}
            button
            onClick={() => navigate(`/escolher-venda/${customer._id}`)}
          >
            <ListItemText primary={customer.name} secondary={customer.email} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default CustomerFilter;
