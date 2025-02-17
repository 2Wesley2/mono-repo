import React, { MouseEvent, FC, memo, useCallback } from 'react';
import { IconButton, Paper, ListItem } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { TierItemRootProps, TierIconEditProps, OnClickHandler, TierItemComponents } from '../types/tier';

const TierItemRoot: FC<TierItemRootProps> = memo((props) => {
  const { children, sx } = props;
  return (
    <ListItem>
      <Paper elevation={1} tabIndex={0} role="group" sx={sx}>
        {children}
      </Paper>
    </ListItem>
  );
});

TierItemRoot.displayName = 'TierItemRoot';

const TierIconEdit: FC<TierIconEditProps> = memo((props) => {
  const { onClick } = props;
  const handleClick: OnClickHandler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onClick(e);
    },
    [onClick]
  );

  return (
    <IconButton onClick={handleClick}>
      <EditIcon />
    </IconButton>
  );
});

TierIconEdit.displayName = 'TierIconEdit';

export const TierItem: TierItemComponents = {
  Root: TierItemRoot,
  IconEdit: TierIconEdit
} as const;
