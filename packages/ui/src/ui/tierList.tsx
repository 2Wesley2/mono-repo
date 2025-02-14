import React, { useState, KeyboardEvent } from 'react';
import { IconButton, Paper, Typography, List, ListItem, Box } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { TierListPropsUI } from '../types/tiers';
import { TierField } from './tierField';

export const TierList: React.FC<TierListPropsUI> = ({ tiers, onChange }) => {
  const [editingTierId, setEditingTierId] = useState<string | null>(null);

  const handleEditing = (id: string) => {
    if (editingTierId === id) {
      setEditingTierId(null);
    } else {
      setEditingTierId(id);
    }
  };

  const handleIconKeyDown = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEditing(id);
    }
  };

  return (
    <List>
      {tiers.map((tier) => {
        const isEditing = editingTierId === tier.id;
        const legendId = `legend-tier-${tier.id}`;

        return (
          <ListItem key={tier.id}>
            <Paper
              elevation={1}
              tabIndex={0}
              role="group"
              aria-labelledby={legendId}
              sx={{ width: '100%', padding: 2, position: 'relative' }}
            >
              <Typography variant="h6" id={legendId}>
                Faixa {tier.id}
              </Typography>
              <IconButton
                aria-label={`Editar faixa ${tier.id}`}
                onClick={() => handleEditing(tier.id)}
                onKeyDown={(e) => handleIconKeyDown(e, tier.id)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <EditIcon />
              </IconButton>
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mt={2}>
                <Box flex={1}>
                  <TierField
                    label="Valor Mínimo:"
                    fieldId={`min-value-${tier.id}`}
                    value={tier.minValue}
                    editing={isEditing}
                    onChange={(newVal) => onChange(tier.id, 'minValue', newVal)}
                  />
                </Box>
                <Box flex={1}>
                  <TierField
                    label="Crédito Ganho:"
                    fieldId={`credit-value-${tier.id}`}
                    value={tier.creditValue}
                    editing={isEditing}
                    onChange={(newVal) => onChange(tier.id, 'creditValue', newVal)}
                  />
                </Box>
              </Box>
            </Paper>
          </ListItem>
        );
      })}
    </List>
  );
};
