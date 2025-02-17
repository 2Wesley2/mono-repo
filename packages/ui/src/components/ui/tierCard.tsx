import React, { useCallback, FC, memo } from 'react';
import { Typography, TextField } from '@mui/material';
import { TierItem } from '../../ui/tier';
import { TierCardRootProps, OnClickHandler, TierToggleInputProps, TierCardComponents } from '../../types/tier';

const TierCardRoot: FC<TierCardRootProps> = memo((props) => {
  const { children, label, sx, onClick } = props;
  const handleIconClick: OnClickHandler = useCallback(
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
});

TierCardRoot.displayName = 'TierCardRoot';

const TierToggleInput: FC<TierToggleInputProps> = memo((props) => {
  const { onChange, value, editing } = props;
  return editing ? <TextField value={value} onChange={(e) => onChange(e)} /> : <Typography>{value}</Typography>;
});

TierToggleInput.displayName = 'TierToggleInput';

export const TierCard: TierCardComponents = {
  Root: TierCardRoot,
  ToggleInput: TierToggleInput
} as const;
