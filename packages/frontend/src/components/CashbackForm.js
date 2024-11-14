// components/CashbackForm.jsx

import { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { createCashback, updateCashback } from '../service/cashback';
import React from 'react';

const CashbackForm = ({ cashback: initialCashback, onBack }) => {
  const isEditMode = Boolean(initialCashback);

  const [cashback, setCashback] = useState({
    name: initialCashback ? initialCashback.name : '',
    isActive: initialCashback ? initialCashback.isActive : false,
  });

  const [rules, setRules] = useState(
    initialCashback
      ? initialCashback.ruleDiscont
      : [
          {
            discountType: 'percentage',
            minPurchaseAmount: '',
            maxPurchaseAmount: '',
            discountPercentage: '',
            discountFixedValue: '',
          },
        ],
  );

  const handleCashbackChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setCashback((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleRuleChange = useCallback((index, field, value) => {
    setRules((prevRules) => {
      const updatedRules = [...prevRules];
      updatedRules[index][field] = value;
      return updatedRules;
    });
  }, []);

  const addRule = useCallback(() => {
    setRules((prev) => [
      ...prev,
      {
        discountType: 'percentage',
        minPurchaseAmount: '',
        maxPurchaseAmount: '',
        discountPercentage: '',
        discountFixedValue: '',
      },
    ]);
  }, []);

  const removeRule = useCallback((index) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const cashbackData = {
        name: cashback.name,
        isActive: cashback.isActive,
        tiers: rules.map((rule) => ({
          discountType: rule.discountType,
          minPurchaseAmount: Number(rule.minPurchaseAmount),
          maxPurchaseAmount: Number(rule.maxPurchaseAmount),
          discountPercentage:
            rule.discountType === 'percentage'
              ? Number(rule.discountPercentage)
              : undefined,
          discountFixedValue:
            rule.discountType === 'fixed'
              ? Number(rule.discountFixedValue)
              : undefined,
        })),
      };

      try {
        if (isEditMode) {
          await updateCashback(initialCashback._id, cashbackData);
          alert('Cashback atualizado com sucesso!');
        } else {
          await createCashback(cashbackData);
          alert('Cashback criado com sucesso!');
        }
        onBack();
      } catch (error) {
        console.error(error);
        alert(
          isEditMode ? 'Erro ao atualizar cashback' : 'Erro ao criar cashback',
        );
      }
    },
    [cashback, rules, isEditMode, initialCashback, onBack],
  );

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
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
          onClick={onBack}
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
      </Box>

      <Typography variant="h5" mb={2}>
        {isEditMode ? 'Editar Cashback' : 'Criar Cashback'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome do Cashback"
          name="name"
          value={cashback.name}
          onChange={handleCashbackChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={cashback.isActive}
              onChange={handleCashbackChange}
              name="isActive"
            />
          }
          label="Ativo"
        />

        <Box mt={3}>
          <Typography variant="h6">Regras de Desconto</Typography>
          {rules.map((rule, index) => (
            <Paper key={index} sx={{ p: 2, mt: 2, position: 'relative' }}>
              <IconButton
                onClick={() => removeRule(index)}
                size="small"
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <RemoveIcon />
              </IconButton>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Tipo de Desconto</InputLabel>
                <Select
                  value={rule.discountType}
                  onChange={(e) =>
                    handleRuleChange(index, 'discountType', e.target.value)
                  }
                >
                  <MenuItem value="percentage">Percentual</MenuItem>
                  <MenuItem value="fixed">Valor Fixo</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Valor Mínimo de Compra"
                type="number"
                value={rule.minPurchaseAmount}
                onChange={(e) =>
                  handleRuleChange(index, 'minPurchaseAmount', e.target.value)
                }
                fullWidth
                required
                sx={{ mt: 2 }}
              />

              <TextField
                label="Valor Máximo de Compra"
                type="number"
                value={rule.maxPurchaseAmount}
                onChange={(e) =>
                  handleRuleChange(index, 'maxPurchaseAmount', e.target.value)
                }
                fullWidth
                required
                sx={{ mt: 2 }}
              />

              {rule.discountType === 'percentage' && (
                <TextField
                  label="Percentual de Desconto"
                  type="number"
                  value={rule.discountPercentage}
                  onChange={(e) =>
                    handleRuleChange(
                      index,
                      'discountPercentage',
                      e.target.value,
                    )
                  }
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
              )}

              {rule.discountType === 'fixed' && (
                <TextField
                  label="Valor de Desconto Fixo"
                  type="number"
                  value={rule.discountFixedValue}
                  onChange={(e) =>
                    handleRuleChange(
                      index,
                      'discountFixedValue',
                      e.target.value,
                    )
                  }
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
              )}
            </Paper>
          ))}
          <Button startIcon={<AddIcon />} onClick={addRule} sx={{ mt: 2 }}>
            Adicionar Regra de Desconto
          </Button>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
        >
          {isEditMode ? 'Salvar Edição' : 'Salvar Cashback'}
        </Button>
      </form>
    </Paper>
  );
};

// Aplicação de React.memo
export default React.memo(CashbackForm);
