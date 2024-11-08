import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
} from '@mui/material';

const CashbackDetails = ({ cashback, onBack, onEdit }) => {
  if (!cashback) {
    return null;
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Detalhes do Cashback
      </Typography>

      <Paper sx={{ padding: 3, borderRadius: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {cashback.name}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Status: {cashback.isActive ? 'Ativo' : 'Inativo'}
        </Typography>
      </Paper>

      <Box>
        <Typography variant="h6" gutterBottom>
          Tiers de Desconto
        </Typography>

        {cashback.ruleDiscont && cashback.ruleDiscont.length > 0 ? (
          <List>
            {cashback.ruleDiscont.map((tier, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`Tipo de Desconto: ${tier.discountType === 'percentage' ? `${tier.discountPercentage}%` : `R$${tier.discountFixedValue}`}`}
                    secondary={`Mínimo: R$${tier.minPurchaseAmount} - Máximo: R$${tier.maxPurchaseAmount}`}
                  />
                </ListItem>
                {index < cashback.ruleDiscont.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Nenhum tier de desconto associado.
          </Typography>
        )}
      </Box>

      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onBack();
          }}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            onEdit();
          }}
        >
          Editar
        </Button>
      </Box>
    </Container>
  );
};

export default CashbackDetails;
