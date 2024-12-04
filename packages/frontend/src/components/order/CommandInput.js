'use client';
import React from 'react';
import { TextField, Typography } from '@mui/material';
import { useOrderState } from '../../context/useOrderState';

const CommandInput = () => {
  const {
    commandNumber,
    setCommandNumber,
    activeCommandNumber,
    handleCommandNumberEnter,
    isWaitingForProduct,
  } = useOrderState();


  return (
    <>
      <Typography
        gutterBottom
        sx={{
          fontFamily: 'Roboto, Arial, sans-serif',
          display: 'flex',
          alignSelf: 'flex-start',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: activeCommandNumber ? '#E50914' : '#006400',
        }}
      >
        {activeCommandNumber ? (
          <>
            Comanda&nbsp;
            <Typography
              component="span"
              sx={{
                fontSize: 'inherit',
                fontWeight: 'bold',
                color: '#000000',
              }}
            >
              {activeCommandNumber}
            </Typography>
            &nbsp;aguardando produto
          </>
        ) : (
          'Aguardando Comanda'
        )}
      </Typography>
      <TextField
        autoFocus
        value={commandNumber}
        onChange={(e) => {
          setCommandNumber(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleCommandNumberEnter(e);
          }
        }}
        placeholder="Número da comanda ou 'X'"
        aria-label="Campo para inserir o número da comanda ou finalizar com X"
        sx={{
          width: '50%',
          backgroundColor: '#FFFFFF',
          '& .MuiInputBase-root': {
            fontFamily: 'Roboto, Arial, sans-serif',
            fontWeight: 'bold',
            fontSize: '1.25rem',
          },
        }}
        margin="dense"
      />
    </>
  );
};

export default React.memo(CommandInput);
