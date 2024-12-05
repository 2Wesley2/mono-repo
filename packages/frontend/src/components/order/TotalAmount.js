'use client';
import { Typography, Box } from '@mui/material';
import { useOrderState } from '../../context/useOrderState';

const TotalAmount = () => {
  const { activeCommandNumber, currentOrder } = useOrderState();
  const totalAmount = currentOrder?.totalAmount;

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '';
    return amount.toFixed(2).replace('.', ',');
  };
  const commonStyles = {
    fontFamily: 'inherit',
    fontSize: '2rem',
    fontWeight: 'bold',
    WebkitBackgroundClip: 'text',
    textShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
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
