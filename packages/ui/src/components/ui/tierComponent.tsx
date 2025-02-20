import React, { useCallback, FC, memo } from 'react';
import { Typography, TextField, Box } from '@mui/material';
import { TierItem } from '../../ui/tierBase';
import { Styles } from '../../types/style';
import { TierCardRootProps, TierHeaderProps, TierToggleInputProps, TierCardComponents } from '../../types/tier';

const styles: Styles = {
  TierCardRoot: {
    Root: { flexDirection: 'column' }
  },
  TierHeader: {
    Box: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between'
    }
  }
};

const TierCardRoot: FC<TierCardRootProps> = memo((props: TierCardRootProps) => {
  const { children, sx } = props;
  return (
    <TierItem.Root sx={{ ...((styles.TierCardRoot as Styles).Root as Styles), ...(sx as Styles) }}>
      {children}
    </TierItem.Root>
  ) as JSX.Element;
});

TierCardRoot.displayName = 'TierCardRoot' as string;

const TierHeader: FC<TierHeaderProps> = memo((props: TierHeaderProps) => {
  const { title, onEdit, onDelete, sx } = props;
  const handleIconClick = useCallback(
    (_e: React.MouseEvent<HTMLButtonElement>) => {
      onEdit();
    },
    [onEdit]
  );

  const handleDeleteClick = useCallback(
    (_e: React.MouseEvent<HTMLButtonElement>) => {
      onDelete();
    },
    [onDelete]
  );

  return (
    <Box sx={{ ...((styles.TierHeader as Styles).Box as Styles), ...(sx as Styles) }}>
      <Typography>Faixa {title}</Typography>
      <Box>
        <TierItem.IconEdit onClick={handleIconClick} />
        <TierItem.IconDelete onClick={handleDeleteClick} />
      </Box>
    </Box>
  ) as JSX.Element;
});

TierHeader.displayName = 'TierHeader' as string;

const TierToggleInput: FC<TierToggleInputProps> = memo((props: TierToggleInputProps) => {
  const { onChange, value, editing, title, label } = props;
  return (
    editing ? (
      <TextField label={label} value={value} onChange={(e) => onChange(e)} fullWidth={true} />
    ) : (
      <TierItem.Details title={title} value={value} />
    )
  ) as JSX.Element;
});

TierToggleInput.displayName = 'TierToggleInput' as string;

export const TierCard: TierCardComponents = {
  Root: TierCardRoot,
  Header: TierHeader,
  ToggleInput: TierToggleInput
} as const;
