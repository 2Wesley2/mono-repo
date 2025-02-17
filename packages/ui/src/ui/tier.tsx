import React, { MouseEvent, FC, memo, useCallback } from 'react';
import { IconButton, Paper, ListItem } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { TierItemRootProps, TierIconEditProps, OnClickHandler, TierItemComponents } from '../types/tier';

const styles = {
  ListItem: {
    display: 'flex',
    width: '100%'
  }
};

const TierItemRoot: FC<TierItemRootProps> = memo((props) => {
  const { children, sx } = props;
  return (
    <ListItem
      component={Paper}
      tabIndex={0}
      role="group"
      square={true}
      disableGutters={false}
      divider={true}
      variant="outlined"
      sx={{ ...sx, ...styles.ListItem }}
    >
      {children}
    </ListItem>
  );
});

TierItemRoot.displayName = 'TierItemRoot';

const TierIconEdit: FC<TierIconEditProps> = memo((props) => {
  const { onClick, sx } = props;
  const handleClick: OnClickHandler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onClick(e);
    },
    [onClick]
  );

  return (
    <IconButton sx={{ ...sx }} edge={false} disableFocusRipple={true} onClick={handleClick}>
      <EditIcon />
    </IconButton>
  );
});

TierIconEdit.displayName = 'TierIconEdit';

export const TierItem: TierItemComponents = {
  Root: TierItemRoot,
  IconEdit: TierIconEdit
} as const;
