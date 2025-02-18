import React, { useCallback, FC, memo } from 'react';
import { Typography, TextField, Box } from '@mui/material';
import { TierItem } from '../../ui/tier';
import { Styles } from '../../types/style';
import { TierCardRootProps, OnClickHandler, TierToggleInputProps, TierCardComponents } from '../../types/tier';

const styles: Styles = {
  TierCardRoot: {
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
      width: '100%',
      gap: '1rem'
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
    <TierItem.Root sx={{ ...((styles.TierCardRoot as Styles).Root as Styles), ...(sxRoot as Styles) }}>
      <Box sx={{ ...((styles.TierCardRoot as Styles).Box as Styles), ...(sxBox as Styles) }}>
        <Typography>Faixa {label}</Typography>
        <TierItem.IconEdit onClick={handleIconClick} />
      </Box>
      {children}
    </TierItem.Root>
  );
});

TierCardRoot.displayName = 'TierCardRoot';

const TierToggleInput: FC<TierToggleInputProps> = memo((props: TierToggleInputProps) => {
  const { onChange, value, editing, title, label, sxBox } = props;
  return (
    <Box sx={{ ...((styles.TierToggleInput as Styles).Box as Styles), ...(sxBox as Styles) }}>
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
