import React from 'react';
import { Box, List, ListItem, ListItemText, ButtonBase, IconButton, Divider } from '@mui/material';
import Link from 'next/link';
import CloseIcon from '@mui/icons-material/Close';

export const DrawerContent = ({ links, onClose }) => {
  return (
    <Box sx={{ width: 250 }} role="presentation" onClick={onClose} onKeyDown={onClose}>
      <IconButton onClick={onClose} sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
        <CloseIcon />
      </IconButton>
      <Divider />
      <List onClick={onClose} onKeyDown={onClose}>
        {links.map((item) => (
          <ListItem key={item.text}>
            <ButtonBase sx={{ width: '100%' }}>
              <Link href={item.href} passHref>
                <ListItemText primary={item.text} />
              </Link>
            </ButtonBase>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
