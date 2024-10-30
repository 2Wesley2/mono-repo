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
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getCustomerTickets } from '../service/index';
import { format } from 'date-fns';

const TicketSelection = ({ customer, onSelectTicket, onBack, onNextWithoutTicket }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const cpf = customer.cpf
  const client = { ...customer }

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsData = await getCustomerTickets(cpf);
        setTickets(ticketsData);
      } catch (error) {
        console.error('Erro ao carregar tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (cpf) fetchTickets();
  }, [cpf]);

  const getStatusChip = (status) => {
    switch (status) {
      case 'available':
        return <Chip label="Disponível"
          style={{
            backgroundColor: '#4CAF50',
            color: '#FFFFFF'
          }}
          icon={
            <CheckCircleIcon style={{
              color: '#FFFFFF'
            }} />
          }
        />;
      case 'used':
        return <Chip label="Usado"
          style={{
            backgroundColor: '#000000',
            color: '#FFEB3B'
          }}
          icon={
            <ErrorIcon style={{
              color: '#FFEB3B'
            }}/>
          }
        />;
      case 'expired':
        return <Chip
          label="Expirado"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#F44336'
          }}
          icon={
            <AccessTimeIcon style={{
              color: '#FFFFFF'
            }} />
          }
        />;
      default:
        return null;
    }
  };

  return (
    <Fade in={!loading}>
      <Container maxWidth="sm" sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
          <Button
            onClick={onBack}
            variant="contained"
            color="secondary"
            startIcon={<ArrowBackIosNewIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: 2,
              px: 3,
              py: 1,
              '&:hover': { backgroundColor: 'secondary.dark' },
            }}
            aria-label="Voltar para a página anterior"
          >
            Voltar
          </Button>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          color="primary"
          sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}
        >
          Selecione um Ticket
        </Typography>

        {tickets.length === 0 ? (
          <Paper sx={{ p: 3, width: '100%', textAlign: 'center', borderRadius: 3, bgcolor: 'grey.100' }}>
            <Typography variant="body1" color="textSecondary">
              Nenhum ticket disponível para este cliente.
            </Typography>
          </Paper>
        ) : (
          <List sx={{ width: '100%', mt: 2 }}>
            {tickets.map((ticket) => (
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
                      backgroundColor: 'grey.100',
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
                      '&:hover .MuiAvatar-root': {
                        bgcolor: 'primary.light',
                      },
                    }}
                    aria-label={`Selecionar ticket ${ticket._id}`}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <ConfirmationNumberIcon />
                      </Avatar>
                      <ListItemText
                        primary={`Cliente: ${client.name}`}
                        secondary={`Desconto: ${ticket.discount}%`}
                        tertiary={`cpf: ${client.cpf}`}
                        primaryTypographyProps={{
                          variant: 'subtitle1',
                          color: 'textPrimary',
                          fontWeight: 'bold',
                        }}
                        secondaryTypographyProps={{
                          variant: 'body2',
                          color: 'textSecondary',
                        }}
                      />
                      {getStatusChip(ticket.status)}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
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
            <Divider sx={{ mt: 3 }} />
          </List>
        )}

        <Button
          onClick={onNextWithoutTicket}
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          aria-label="Prosseguir sem selecionar ticket"
        >
          Prosseguir sem Ticket
        </Button>
      </Container>
    </Fade>
  );
};

export default TicketSelection;
