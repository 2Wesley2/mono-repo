import { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Paper,
  Container,
  Fade,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { getAllCustomers } from '../service/index';
import Title from '../components/Title';

const CustomerSelection = ({ onSelectCustomer, onBack }) => {
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

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Title>Selecione um Cliente</Title>

      {loading ? (
        <CircularProgress color="primary" />
      ) : (
        <Fade in={!loading}>
          <Box sx={{ width: '100%' }}>
            {customers.length === 0 ? (
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: 'grey.100',
                }}
              >
                <Typography variant="body1" color="textSecondary">
                  Nenhum cliente encontrado.
                </Typography>
              </Paper>
            ) : (
              <List>
                {customers.map((customer) => (
                  <Fade in key={customer.cpf} timeout={400}>
                    <Paper
                      elevation={3}
                      sx={{
                        backgroundColor: '#FAFAFA',
                        mb: 2,
                        p: 2,
                        '&:hover': { boxShadow: 6, bgcolor: 'grey.100' },
                        borderRadius: 2,
                        transition: 'box-shadow 0.2s, background-color 0.2s',
                      }}
                    >
                      <ListItem
                        button
                        onClick={() => onSelectCustomer(customer)}
                        sx={{
                          backgroundColor: '#FAFAFA',
                          display: 'flex',
                          alignItems: 'center',
                          p: 1,
                          '&:focus': {
                            outline: '2px solid',
                            outlineColor: 'primary.main',
                          },
                        }}
                        aria-label={`Selecionar cliente ${customer.name} com CPF ${customer.cpf}`}
                      >
                        <PersonIcon sx={{ color: '#E50914', mr: 2 }} />
                        <ListItemText
                          primary={`${customer.name}`}
                          secondary={`CPF: ${customer.cpf}`}
                          primaryTypographyProps={{
                            fontWeight: 'bold',
                            color: 'textPrimary',
                          }}
                          secondaryTypographyProps={{ color: 'textSecondary' }}
                        />
                      </ListItem>
                    </Paper>
                  </Fade>
                ))}
              </List>
            )}
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default CustomerSelection;
