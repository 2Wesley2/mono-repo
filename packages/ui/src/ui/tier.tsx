import React, { MouseEvent, FC, memo, useCallback } from 'react';
import { SxProps, Theme, IconButton, Paper, ListItem } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

interface TierItemRootProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const TierItemRoot: FC<TierItemRootProps> = memo(({ children, sx }) => (
  <ListItem>
    <Paper elevation={1} tabIndex={0} role="group" sx={sx}>
      {children}
    </Paper>
  </ListItem>
));
TierItemRoot.displayName = 'TierItemRoot';

type OnClickHandler = (e: MouseEvent<HTMLButtonElement>) => void;
const TierIconEdit: FC<{ onClick: OnClickHandler }> = memo(({ onClick }) => {
  const handleClick = useCallback(
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

type TierItemInterface = {
  Root: FC<TierItemRootProps>;
  IconEdit: FC<{ onClick: OnClickHandler }>;
};

export const TierItem: TierItemInterface = {
  Root: TierItemRoot,
  IconEdit: TierIconEdit
} as const;
