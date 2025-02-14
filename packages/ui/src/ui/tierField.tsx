import React from 'react';
import { TextField, Typography } from '@mui/material';
import { TierFieldProps } from '../types/tiers';

export const TierField: React.FC<TierFieldProps> = ({ label, fieldId, value, editing, onChange, className }) => {
  return (
    <div className={className}>
      <Typography variant="subtitle1" component="label" htmlFor={fieldId}>
        {label}
      </Typography>
      {editing ? (
        <TextField
          type="number"
          id={fieldId}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          variant="outlined"
          fullWidth
          margin="normal"
        />
      ) : (
        <Typography variant="body1" component="p">
          {value}
        </Typography>
      )}
    </div>
  );
};
