// src/components/SaleForm.js

import { useState, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { createSale } from '../service/index';

const SaleForm = ({ cpf, ticket, onBack }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const discount = ticket ? ticket.discount : 0;
    setFinalAmount(totalAmount * (1 - discount / 100));
  }, [totalAmount, ticket]);

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const saleData = {
        clientCPF: cpf,
        ticketId: ticket ? ticket._id : null,
        totalAmount,
        finalAmount,
      };
      const result = await createSale(saleData);
      alert(`Venda realizada! Valor final: ${result.finalAmount}`);
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSaleSubmit}>
      <Button onClick={onBack} variant="contained" color="secondary">
        Voltar
      </Button>
      <Typography variant="h6">Finalizar Venda</Typography>
      <TextField
        label="Valor Total"
        type="number"
        value={totalAmount}
        onChange={(e) => setTotalAmount(Number(e.target.value))}
        required
        fullWidth
        margin="normal"
      />
      {ticket && <Typography>Desconto aplicado: {ticket.discount}%</Typography>}
      <Typography>Valor Final: {finalAmount.toFixed(2)}</Typography>
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? 'Processando...' : 'Finalizar Venda'}
      </Button>
    </form>
  );
};

export default SaleForm;
