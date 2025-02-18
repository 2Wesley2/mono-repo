import React, { MouseEvent, FC, memo, useCallback } from 'react';
import { IconButton, Paper, ListItem, Typography } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import {
  TierItemRootProps,
  TierIconEditProps,
  OnClickHandler,
  TierItemDetailsProps,
  TierItemComponents
} from '../types/tier';
import { Styles } from '../types/style';

const styles: Styles = {
  TierItemRoot: {
    ListItem: {
      display: 'flex',
      width: '100%'
    }
  },
  TierItemDetails: {
    Typography: {
      width: '100%'
    }
  }
};

const TierItemRoot: FC<TierItemRootProps> = memo((props: TierItemRootProps) => {
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
      sx={{ ...((styles.TierItemRoot as Styles).ListItem as Styles), ...(sx as Styles) }}
    >
      {children}
    </ListItem>
  );
});

TierItemRoot.displayName = 'TierItemRoot';
const TierItemDetails: FC<TierItemDetailsProps> = memo((props: TierItemDetailsProps) => {
  const { title, value, sxTitle, sxValue } = props;
  return (
    <Typography sx={{ ...((styles.TierItemDetails as Styles).Typography as Styles), ...(sxValue as Styles) }}>
      {title && (
        <Typography
          variant="subtitle2"
          sx={{ ...((styles.TierItemDetails as Styles).Typography as Styles), ...(sxTitle as Styles) }}
        >
          {title}
        </Typography>
      )}
      {value}
    </Typography>
  );
});

TierItemDetails.displayName = 'TierItemDetails';

const TierIconEdit: FC<TierIconEditProps> = memo((props: TierIconEditProps) => {
  const { onClick, sx } = props;
  const handleClick: OnClickHandler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onClick(e);
    },
    [onClick]
  );

  return (
    <IconButton sx={{ ...(sx as Styles) }} edge={false} disableFocusRipple={true} onClick={handleClick}>
      <EditIcon />
    </IconButton>
  );
});

TierIconEdit.displayName = 'TierIconEdit';

export const TierItem: TierItemComponents = {
  Root: TierItemRoot,
  Details: TierItemDetails,
  IconEdit: TierIconEdit
} as const;
