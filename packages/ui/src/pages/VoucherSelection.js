import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import { fetchCustomerVouchers } from '../services/salesService';

const VoucherSelection = () => {
  const { customerId } = useParams();
  const [vouchers, setVouchers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomerVouchers(customerId)
      .then((data) => setVouchers(data))
      .catch((error) => console.error(error));
  }, [customerId]);

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Selecionar Voucher
      </Typography>
      {vouchers.length === 0 ? (
        <Typography variant="body1">Nenhum voucher disponível</Typography>
      ) : (
        <List>
          {vouchers.map((voucher) => (
            <ListItem
              key={voucher.id}
              button
              onClick={() => navigate(`/checkout-venda/${customerId}/${voucher.id}`)}
            >
              <ListItemText
                primary={`Desconto: ${voucher.discountPercentage || voucher.voucherValue} %`}
                secondary={`Expira em: ${new Date(voucher.validUntil).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default VoucherSelection;
