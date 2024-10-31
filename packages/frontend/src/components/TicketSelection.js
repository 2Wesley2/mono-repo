import { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
  Typography,
  Box,
  Container,
  Divider,
  Fade,
  Avatar,
  Paper,
  Chip,
  Select,
  MenuItem,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getCustomerTickets } from '../service/index';
import { format } from 'date-fns';

const TicketSelection = ({ customer, onSelectTicket, onBack, onNextWithoutTicket }) => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('available');
  const cpf = customer.cpf;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsData = await getCustomerTickets(cpf);
        setTickets(ticketsData);
        filterTickets(ticketsData, 'available');
      } catch (error) {
        console.error('Erro ao carregar tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (cpf) fetchTickets();
  }, [cpf]);

  const filterTickets = (ticketsData, status) => {
    const sortedTickets = ticketsData
      .filter(ticket => status === 'all' ? true : ticket.status === status)
      .sort(ticket => ticket.status === 'available' ? -1 : 1);
    setFilteredTickets(sortedTickets);
  };

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
    filterTickets(tickets, selectedFilter);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'available':
        return <Chip
          label="Disponível"
          sx={{
            bgcolor: '#4CAF50',
            color: '#FFFFFF'
          }}
          icon={<CheckCircleIcon sx={{ color: '#FFFFFF' }} />} />;
      case 'used':
        return <Chip
          label="Usado"
          sx={{
            bgcolor: '#000000',
            color: '#FFEB3B'
          }}
          icon={<ErrorIcon sx={{ color: '#FFEB3B' }} />} />;
      case 'expired':
        return <Chip
          label="Expirado"
          sx={{
            bgcolor: '#FFFFFF',
            color: '#F44336'
          }}
          icon={<AccessTimeIcon sx={{ color: '#FFFFFF' }} />} />;
      default:
        return null;
    }
  };

  return (
    <Fade in={!loading}>
      <Container maxWidth="sm"
        sx={{
          mt: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            gap: 2
          }}>
          <Button
            onClick={onBack}
            sx={{
              color: 'grey.700',
              textTransform: 'none', '&:hover': { bgcolor: 'grey.200' }
            }}
            aria-label="Voltar para a página anterior"
            startIcon={<ArrowBackIosNewIcon />}
          >
            Voltar
          </Button>

          <Select
            value={filter}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
            sx={{ bgcolor: 'white', borderRadius: 1 }}
            aria-label="Filtrar tickets por status"
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="available">Disponíveis</MenuItem>
            <MenuItem value="used">Usados</MenuItem>
            <MenuItem value="expired">Expirados</MenuItem>
          </Select>

          <Button
            onClick={onNextWithoutTicket}
            sx={{
              color: 'grey.700',
              textTransform: 'none', '&:hover': { bgcolor: 'grey.200' }
            }}
            aria-label="Prosseguir sem selecionar ticket"
            endIcon={<ArrowForwardIosIcon />}
          >
            Prosseguir venda sem ticket
          </Button>
        </Box>

        <Typography variant="h5"
          component="h2"
          color="primary"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 3
          }}>
          Selecione um Ticket
        </Typography>

        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          filteredTickets.length === 0 ? (
            <Paper
              sx={{
                p: 3,
                width: '100%',
                textAlign: 'center',
                borderRadius: 3,
                bgcolor: 'grey.100'
              }}>
              <Typography variant="body1" color="textSecondary">
                Nenhum ticket disponível.
              </Typography>
            </Paper>
          ) : (
            <List sx={{ width: '100%', mt: 2 }}>
              {filteredTickets.map(ticket => (
                <Fade in key={ticket._id} timeout={600}>
                  <Paper
                    elevation={3}
                    sx={{
                      mb: 2,
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 6,
                        bgcolor: 'grey.100'
                      },
                      borderRadius: 2,
                    }}
                  >
                    <ListItem
                      button
                      onClick={() => onSelectTicket(ticket)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        p: 2,
                      }}
                      aria-label={`Selecionar ticket ${ticket._id}`}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1,
                          width: '100%'
                        }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          <ConfirmationNumberIcon />
                        </Avatar>
                        <ListItemText
                          primary={`Cliente: ${customer.name}`}
                          secondary={`Desconto: ${ticket.discount}%`}
                          primaryTypographyProps={{
                            variant: 'subtitle1',
                            color: 'textPrimary',
                            fontWeight: 'bold'
                          }}
                          secondaryTypographyProps={{
                            variant: 'body2',
                            color: 'textSecondary'
                          }}
                        />
                        {getStatusChip(ticket.status)}
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                          mt: 1
                        }}>
                        <Typography variant="body2" color="textSecondary">
                          Data de Expiração: {format(new Date(ticket.expiryDate), 'dd/MM/yyyy')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Gerado em: {format(new Date(ticket.generatedDate), 'dd/MM/yyyy')}
                        </Typography>
                      </Box>
                    </ListItem>
                  </Paper>
                </Fade>
              ))}
              <Divider
                sx={{ mt: 3 }} />
            </List>
          )
        )}
      </Container>
    </Fade>
  );
};

export default TicketSelection;
