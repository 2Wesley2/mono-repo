'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Paper,
  Fade,
  Button,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const CashbackList = ({ cashbacks, onSelectCashback, onCreateCashback }) => {
  const [activeCashback, setActiveCashback] = useState(null);
  const [inactiveCashbacks, setInactiveCashbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cashbacks.length > 0) {
      const active = cashbacks.find((cashback) => cashback.isActive);
      const inactive = cashbacks.filter((cashback) => !cashback.isActive);

      setActiveCashback(active);
      setInactiveCashbacks(inactive);
    }
    setLoading(false);
  }, [cashbacks]);

  const handleSelectCashback = useCallback(
    (cashback) => {
      onSelectCashback(cashback);
    },
    [onSelectCashback],
  );

  const handleCreateCashback = useCallback(() => {
    onCreateCashback();
  }, [onCreateCashback]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
        my={3}
      >
        <Button
          variant="contained"
          color="error"
          onClick={handleCreateCashback}
          sx={{
            mb: 3,
          }}
        >
          Criar Novo Cashback
        </Button>
      </Box>

      {loading ? (
        <CircularProgress color="primary" />
      ) : (
        <>
          {activeCashback && (
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <Fade in easing={'enter'}>
                <Paper
                  elevation={3}
                  sx={{
                    width: '50%',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 6,
                      bgcolor: 'grey.100',
                    },
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      width: '100%',
                    }}
                  >
                    <ListItem
                      button
                      onClick={() => handleSelectCashback(activeCashback)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        p: 2,
                      }}
                      aria-label={`Selecionar cashback ${activeCashback.name}`}
                    >
                      <LocalOfferIcon sx={{ color: '#E50914', mr: 2 }} />
                      <ListItemText
                        primary={`${activeCashback.name}`}
                        secondary="Status: Ativo"
                        primaryTypographyProps={{
                          fontWeight: 'bold',
                          color: 'textPrimary',
                        }}
                        secondaryTypographyProps={{ color: 'textSecondary' }}
                      />
                    </ListItem>
                  </Box>
                </Paper>
              </Fade>
            </Box>
          )}

          {inactiveCashbacks.length > 0 && (
            <Box sx={{ mt: 4, width: '100%' }}>
              <Typography variant="h6" color="textPrimary" gutterBottom>
                Cashbacks Inativos
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  overflowX: 'auto',
                  pb: 2,
                  '& > *': { flex: '0 0 auto', width: 150, mr: 2 },
                  '&::-webkit-scrollbar': {
                    height: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#B0BEC5',
                    borderRadius: '10px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#90A4AE',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#ECEFF1',
                    borderRadius: '10px',
                  },
                }}
              >
                {inactiveCashbacks.map((cashback) => (
                  <Fade in key={cashback.id} timeout={400}>
                    <Paper
                      component="button"
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
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleSelectCashback(cashback)}
                    >
                      <LocalOfferIcon sx={{ color: '#E50914', mb: 1 }} />
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="textPrimary"
                        textAlign="center"
                      >
                        {cashback.name}
                      </Typography>
                    </Paper>
                  </Fade>
                ))}
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default React.memo(CashbackList);
