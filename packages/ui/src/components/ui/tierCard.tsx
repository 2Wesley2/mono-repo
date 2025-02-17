import React, { MouseEvent, ChangeEventHandler, useCallback } from 'react';
import { SxProps, Theme, Typography, TextField } from '@mui/material';
import { TierItem } from '../../ui/tier';

type OnClickHandler = (e: MouseEvent<HTMLButtonElement>) => void;
interface TierCardRootProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  editing?: boolean;
  label?: string;
  sx?: SxProps<Theme>;
}

const TierCardRoot: React.FC<TierCardRootProps> = (props) => {
  const { children, label, sx, onClick } = props;
  const handleIconClick = useCallback<OnClickHandler>(
    (e) => {
      onClick(e);
    },
    [onClick]
  );
  return (
    <TierItem.Root sx={sx}>
      <Typography>Faixa {label}</Typography>
      <TierItem.IconEdit onClick={handleIconClick} />
      {children}
    </TierItem.Root>
  );
};

interface TierToggleInputProps {
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  value: string | number;
  editing?: boolean;
}

const TierToggleInput: React.FC<TierToggleInputProps> = (props) => {
  const { onChange, value, editing } = props;
  return (
    <div>{editing ? <TextField value={value} onChange={(e) => onChange(e)} /> : <Typography>{value}</Typography>}</div>
  );
};

export const TierCard = {
  Root: TierCardRoot,
  ToggleInput: TierToggleInput
} as const;
