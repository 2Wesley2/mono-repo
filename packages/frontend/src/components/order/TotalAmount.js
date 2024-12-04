'use client';
import { Typography } from '@mui/material';
import { useOrderState } from '../../context/useOrderState';

const TotalAmount = () => {
  const { activeCommandNumber, currentOrder } = useOrderState();
  const totalAmount = currentOrder?.totalAmount;
  console.log()
  return (
    <>
      {activeCommandNumber !== null ? (
        <Typography
          sx={{
            fontFamily: 'Roboto, Arial, sans-serif !important',
            fontWeight: 'normal',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#000000',
          }}
        >
          {`Total: ${totalAmount}`}
        </Typography>
      ) : (
        <></>
      )}
    </>
  );
};
export default TotalAmount;
