import React, { MouseEvent, ChangeEventHandler } from 'react';
import { SxProps, Theme, Typography, TextField } from '@mui/material';
import { TierItem } from '../../ui/tier';

interface TierCardRootProps {
  children?: React.ReactNode;
  editing?: boolean;
  label?: string;
  sx?: SxProps<Theme>;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const TierCardRoot: React.FC<TierCardRootProps> = (props) => {
  const { children, label, sx, onClick } = props;
  return (
    <TierItem.Root sx={sx}>
      <Typography>Faixa {label}</Typography>
      <TierItem.IconEdit
        onClick={(e) => {
          console.log('Clique no IconEdit:', e);
          onClick(e);
        }}
      />
      {children}
    </TierItem.Root>
  );
};

interface TierToggleInputProps {
  onClick: (e: MouseEvent<HTMLElement>) => void;
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  value: string | number;
  editing?: boolean;
}

const TierToggleInput: React.FC<TierToggleInputProps> = (props) => {
  const { onClick, onChange, value, editing } = props;
  return (
    <div onClick={(e) => onClick(e)}>
      {editing ? <TextField value={value} onChange={(e) => onChange(e)} /> : <Typography>{value}</Typography>}
    </div>
  );
};

export const TierCard = {
  Root: TierCardRoot,
  ToggleInput: TierToggleInput
} as const;
