import React, { useCallback, FC, memo } from 'react';
import { Typography, TextField, Box } from '@mui/material';
import { TierItem } from '../../ui/tier';
import { TierCardRootProps, OnClickHandler, TierToggleInputProps, TierCardComponents } from '../../types/tier';
const styles = {
  Typography: {
    width: '100%'
  },
  Box: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  TierItemRoot: {
    flexDirection: 'column'
  }
};

const TierCardRoot: FC<TierCardRootProps> = memo((props) => {
  const { children, label, onClick } = props;
  const handleIconClick: OnClickHandler = useCallback(
    (e) => {
      onClick(e);
    },
    [onClick]
  );
  return (
    <TierItem.Root sx={{ ...styles.TierItemRoot }}>
      <Box sx={{ ...styles.Box }}>
        <Typography>Faixa {label}</Typography>
        <TierItem.IconEdit onClick={handleIconClick} />
      </Box>
      {children}
    </TierItem.Root>
  );
});

TierCardRoot.displayName = 'TierCardRoot';

const TierToggleInput: FC<TierToggleInputProps> = memo((props) => {
  const { onChange, value, editing } = props;
  return editing ? (
    <TextField value={value} onChange={(e) => onChange(e)} fullWidth={true} />
  ) : (
    <Typography sx={{ ...styles.Typography }}>{value}</Typography>
  );
});

TierToggleInput.displayName = 'TierToggleInput';

export const TierCard: TierCardComponents = {
  Root: TierCardRoot,
  ToggleInput: TierToggleInput
} as const;
