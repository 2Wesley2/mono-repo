import React, { useCallback } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Container,
  Typography,
  Box,
  Button,
  FormControlLabel,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Title from './Title';

const CashbackDetails = ({ cashback, onBack, onEdit }) => {
  if (!cashback) return null;

  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  const handleEdit = useCallback(() => {
    onEdit();
  }, [onEdit]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          gap: 2,
        }}
      >
        <Button
          onClick={handleBack}
          sx={{
            color: 'grey.700',
            textTransform: 'none',
            '&:hover': { bgcolor: 'grey.200' },
          }}
          aria-label="Voltar para a página anterior"
          startIcon={<ArrowBackIosNewIcon />}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleEdit}
          sx={{
            mb: 3,
          }}
        >
          Editar
        </Button>
      </Box>
      <Paper
        elevation={0}
        sx={{
          padding: 3,
          borderRadius: 3,
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h3"
          sx={{
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: 2,
          }}
        >
          {cashback.name}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: '1rem', // Ajuste de tamanho para diferenciar do título
            fontWeight: cashback.isActive ? 'bold' : 'normal', // Destaca visualmente se estiver ativo
            color: cashback.isActive ? 'success.main' : 'error.main', // Utiliza cores de sucesso/erro
          }}
        >
          {cashback.isActive ? '✔️ Ativo' : '❌ Inativo'}
        </Typography>
      </Paper>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Valor Mínimo</TableCell>
              <TableCell align="center">Valor Máximo</TableCell>
              <TableCell align="center">Desconto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cashback.ruleDiscont.map((tier, index) => (
              <TableRow key={index}>
                <TableCell align="center">R${tier.minPurchaseAmount}</TableCell>
                <TableCell align="center">R${tier.maxPurchaseAmount}</TableCell>
                <TableCell align="center">
                  {tier.discountType === 'percentage'
                    ? `${tier.discountPercentage}%`
                    : `R$${tier.discountFixedValue}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default React.memo(CashbackDetails);
