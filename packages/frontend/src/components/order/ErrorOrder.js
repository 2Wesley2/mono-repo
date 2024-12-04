'use client';
import { Box } from '@mui/material';
import { useOrderState } from '../../context/useOrderState';

const ErrorOrder = () => {
  const { errorMessage } = useOrderState();
  return (
    <>
      {errorMessage && (
        <Box
          sx={{
            padding: 2,
            backgroundColor: 'red',
            color: 'white',
            textAlign: 'center',
          }}
          role="alert"
        >
          {errorMessage}
        </Box>
      )}
    </>
  );
};

export default ErrorOrder;
