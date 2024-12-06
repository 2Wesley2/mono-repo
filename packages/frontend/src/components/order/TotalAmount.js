'use client';
import { Typography, Box } from '@mui/material';
import { useOrderState } from '../../context/useOrderState';
import { formatCurrency } from '../../helper/';

const TotalAmount = () => {
  const { activeCommandNumber, currentOrder } = useOrderState();
  const totalAmount = currentOrder?.totalAmount;

  const commonStyles = {
    fontFamily: 'inherit',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    WebkitBackgroundClip: 'text',
    textTransform: 'uppercase',
  };
  return (
    <>
      {activeCommandNumber !== null ? (
        <Box
          sx={{
            display: 'inline-flex',
            gap: 1,
          }}
        >
          <Typography
            sx={{
              ...commonStyles,
              color: '#000000',
            }}
          >
            {'Total: R$'}
          </Typography>
          <Typography sx={{ ...commonStyles, color: '#E50914' }}>
            {` ${formatCurrency(totalAmount)}`}
          </Typography>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};
export default TotalAmount;
