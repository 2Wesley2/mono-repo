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
        autoComplete="off"
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
              autoComplete="off"
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
            e.target.value = '';
            e.target.focus();
          }
        }}
        slotProps={{
          input: {
            onInput: (e) => {
              e.target.value = e.target.value.toUpperCase();
            },
          },
          autoComplete: 'new-password',
        }}
        autoComplete="off"
        aria-label="Campo para inserir o número da comanda ou finalizar com X"
        sx={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          '& .MuiInputBase-root': {
            fontFamily: 'inherit',
            fontWeight: 'bold',
            fontSize: '1.25rem',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#FFFFFF',
            },
            '&:hover fieldset': {
              borderColor: '#E50914',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E50914',
            },
          },
        }}
        margin="dense"
      />
    </>
  );
};

export default React.memo(CommandInput);
