import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, MenuItem } from '@mui/material';
import { fetchVoucherDetails, submitSale } from '../services/salesService';

const SaleCheckout = () => {
  const { customerId, voucherId } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [voucher, setVoucher] = useState(null);
  const [finalAmount, setFinalAmount] = useState('');
  const [fuelType, setFuelType] = useState('');

  useEffect(() => {
    if (voucherId) {
      fetchVoucherDetails(voucherId)
        .then((data) => setVoucher(data))
        .catch((error) => console.error(error));
    }
  }, [voucherId]);

  const handleAmountChange = (e) => {
    const enteredAmount = parseFloat(e.target.value) || 0;
    setAmount(enteredAmount);

    if (voucher) {
      const discount = voucher.discountPercentage
        ? (enteredAmount * voucher.discountPercentage) / 100
        : voucher.voucherValue;
      setFinalAmount(enteredAmount - discount);
    } else {
      setFinalAmount(enteredAmount);
    }
  };

  const handleFuelTypeChange = (e) => {
    setFuelType(e.target.value);
  };

  const handleSubmitSale = async () => {
    const saleData = {
      customerId,
      amount: parseFloat(amount),
      finalAmount: parseFloat(finalAmount),
      voucherId: voucher?.id || null,
      fuelType,
    };

    try {
      await submitSale(saleData);
      navigate('/confirmacao-venda');
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Checkout de Venda
      </Typography>
      <TextField
        label="Valor Total da Venda"
        type="number"
        fullWidth
        margin="normal"
        value={amount}
        onChange={handleAmountChange}
      />
      <TextField
        select
        label="Tipo de Combustível"
        fullWidth
        margin="normal"
        value={fuelType}
        onChange={handleFuelTypeChange}
      >
        <MenuItem value="gasolina">Gasolina</MenuItem>
        <MenuItem value="alcool">Álcool</MenuItem>
      </TextField>
      {voucher && (
        <Typography variant="body1">
          Valor com desconto: R$ {finalAmount.toFixed(2)}
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={handleSubmitSale}>
        Registrar Venda
      </Button>
    </Container>
  );
};

export default SaleCheckout;
