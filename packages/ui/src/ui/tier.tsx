import React, { MouseEvent } from 'react';
import { SxProps, Theme, IconButton, Paper, ListItem } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

interface TierItemRootProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const TierItemRoot: React.FC<TierItemRootProps> = ({ children, sx }) => (
  <ListItem>
    <Paper elevation={1} tabIndex={0} role="group" sx={sx}>
      {children}
    </Paper>
  </ListItem>
);

const TierIconEdit: React.FC<{ onClick: (e: MouseEvent<HTMLButtonElement>) => void }> = ({ onClick }) => {
  return (
    <>
      <IconButton onClick={(e) => onClick(e)}>
        <EditIcon />
      </IconButton>
    </>
  );
};

export const TierItem = {
  Root: TierItemRoot,
  IconEdit: TierIconEdit
};
