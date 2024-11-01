import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, CircularProgress, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
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
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 400, mx: 'auto', mt: 6 }}>
      <form onSubmit={handleSaleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
             onClick={onBack}
            sx={{ color: 'grey.700', textTransform: 'none', '&:hover': { bgcolor: 'grey.200' } }}
            aria-label="Voltar para a página anterior"
            startIcon={<ArrowBackIosNewIcon />}
          >
            Voltar
          </Button>
        </Box>

        <TextField
          label="Valor Total"
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(Number(e.target.value))}
          required
          fullWidth
          margin="normal"
          inputProps={{ 'aria-label': 'Valor Total da Venda' }}
        />

        {ticket && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Desconto aplicado: {ticket.discount}%
          </Typography>
        )}

        <Typography variant="body1" sx={{ mb: 2 }}>
          Valor Final: R$ {finalAmount.toFixed(2)}
        </Typography>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            textTransform: 'none',
            backgroundColor: '#E50914'
           }}
          aria-label="Finalizar Venda"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Finalizar Venda'}
        </Button>
      </form>
    </Paper>
  );
};

export default SaleForm;
