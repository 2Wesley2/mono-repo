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
  Button,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { getAllCashbacks } from '../service/index';
import Title from './Title';

const CashbackList = ({ onSelectCashback, onCreateCashback }) => {
  const [activeCashback, setActiveCashback] = useState(null);
  const [inactiveCashbacks, setInactiveCashbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCashbacks = async () => {
      try {
        const cashbackData = await getAllCashbacks();
        const active = cashbackData.find((cashback) => cashback.isActive);
        const inactive = cashbackData.filter((cashback) => !cashback.isActive);

        setActiveCashback(active);
        setInactiveCashbacks(inactive);
      } catch (error) {
        console.error('Erro ao buscar cashbacks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCashbacks();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Title>Selecione um Cashback</Title>

      <Button
        variant="contained"
        color="primary"
        onClick={onCreateCashback}
        sx={{ mb: 3 }}
      >
        Criar Novo Cashback
      </Button>

      {loading ? (
        <CircularProgress color="primary" />
      ) : (
        <>
          {activeCashback && (
            <Fade in>
              <Paper
                elevation={3}
                sx={{
                  backgroundColor: '#FAFAFA',
                  mb: 2,
                  p: 2,
                  width: '100%',
                  '&:hover': { boxShadow: 6, bgcolor: 'grey.100' },
                  borderRadius: 2,
                  transition: 'box-shadow 0.2s, background-color 0.2s',
                }}
              >
                <ListItem
                  button
                  onClick={() => onSelectCashback(activeCashback)}
                  sx={{
                    backgroundColor: '#FAFAFA',
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    '&:focus': { outline: '2px solid', outlineColor: 'primary.main' },
                  }}
                  aria-label={`Selecionar cashback ${activeCashback.name}`}
                >
                  <LocalOfferIcon sx={{ color: '#1976D2', mr: 2 }} />
                  <ListItemText
                    primary={`${activeCashback.name}`}
                    secondary="Status: Ativo"
                    primaryTypographyProps={{ fontWeight: 'bold', color: 'textPrimary' }}
                    secondaryTypographyProps={{ color: 'textSecondary' }}
                  />
                </ListItem>
              </Paper>
            </Fade>
          )}

          {inactiveCashbacks.length > 0 && (
            <Box sx={{ mt: 4, width: '100%' }}>
              <Typography variant="h6" color="textPrimary" gutterBottom>
                Cashbacks Inativos
              </Typography>
              <Box sx={{
                display: 'flex',
                overflowX: 'auto',
                pb: 2,
                '& > *': { flex: '0 0 auto', width: 150, mr: 2 },
              }}>
                {inactiveCashbacks.map((cashback) => (
                  <Fade in key={cashback.id} timeout={400}>
                    <Paper
                      elevation={3}
                      sx={{
                        backgroundColor: '#FAFAFA',
                        p: 2,
                        '&:hover': { boxShadow: 6, bgcolor: 'grey.100' },
                        borderRadius: 1,
                        transition: 'box-shadow 0.2s, background-color 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <LocalOfferIcon sx={{ color: '#1976D2', mb: 1 }} />
                      <Typography variant="body1" fontWeight="bold" color="textPrimary" textAlign="center">
                        {cashback.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" textAlign="center">
                        Status: Inativo
                      </Typography>
                    </Paper>
                  </Fade>
                ))}
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default CashbackList;
