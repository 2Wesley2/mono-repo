import React from 'react';
import { TextField } from '@mui/material';

const CommandInput = ({ commandNumber, setCommandNumber, onEnter }) => {
  return (
    <TextField
      autoFocus
      value={commandNumber}
      onChange={(e) => setCommandNumber(e.target.value)}
      onKeyDown={onEnter}
      aria-label="Campo para inserir o número da comanda ou finalizar com X"
      sx={{
        color: '#FF0000',
        display: 'flex',
        alignSelf: 'flex-start',
        width: '50%',
        backgroundColor: '#FFFFFF',
        '& .css-quhxjy-MuiInputBase-root-MuiOutlinedInput-root': {
          fontFamily: 'Roboto, Arial, sans-serif',
          fontWeight: 'bold',
          fontSize: '1.25rem',
        },
      }}
      margin="dense"
    />
  );
};

export default React.memo(CommandInput);
