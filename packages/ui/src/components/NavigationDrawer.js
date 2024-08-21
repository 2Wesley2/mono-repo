'use client';
import React, { useState } from 'react';
import { Drawer, IconButton } from '@mui/material';
import { DrawerContent } from './DrawerContent';
import MenuIcon from '@mui/icons-material/Menu';

export const NavigationDrawer = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  return (
    <>
      <IconButton color="inherit" onClick={toggleDrawer(true)} edge="start">
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        <DrawerContent links={links} onClose={toggleDrawer(false)} />
      </Drawer>
    </>
  );
};
