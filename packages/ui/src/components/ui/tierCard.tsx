import React, { useCallback, FC, memo } from 'react';
import { Typography, TextField, Box } from '@mui/material';
import { TierItem } from '../../ui/tier';
import { Styles } from '../../types/style';
import { TierCardRootProps, OnClickHandler, TierToggleInputProps, TierCardComponents } from '../../types/tier';

const styles: Styles = {
  TierItemRoot: {
    Root: { flexDirection: 'column' },
    Box: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between'
    }
  },
  TierToggleInput: {
    Box: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1.2
    }
  }
};

const TierCardRoot: FC<TierCardRootProps> = memo((props: TierCardRootProps) => {
  const { children, label, onClick, sxRoot, sxBox } = props;
  const handleIconClick: OnClickHandler = useCallback(
    (e) => {
      onClick(e);
    },
    [onClick]
  );
  return (
    <TierItem.Root sx={{ ...(styles.TierItemRoot as Styles).Root, ...(sxRoot as Styles) }}>
      <Box sx={{ ...styles.Box, ...(sxBox as Styles) }}>
        <Typography>Faixa {label}</Typography>
        <TierItem.IconEdit onClick={handleIconClick} />
      </Box>
      {children}
    </TierItem.Root>
  );
});

TierCardRoot.displayName = 'TierCardRoot';

const TierToggleInput: FC<TierToggleInputProps> = memo((props: TierToggleInputProps) => {
  const { onChange, value, editing, title, label } = props;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
      {editing ? (
        <TextField label={label} value={value} onChange={(e) => onChange(e)} fullWidth={true} />
      ) : (
        <TierItem.Details title={title} value={value} />
      )}
    </Box>
  );
});

TierToggleInput.displayName = 'TierToggleInput';

export const TierCard: TierCardComponents = {
  Root: TierCardRoot,
  ToggleInput: TierToggleInput
} as const;
