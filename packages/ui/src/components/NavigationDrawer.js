'use client';
import React from 'react';
import { Drawer, IconButton } from '@mui/material';
import { DrawerContent } from './DrawerContent';
import MenuIcon from '@mui/icons-material/Menu';

export const NavigationDrawer = ({ links, isOpen, onToggleDrawer }) => {
  console.log('NavigationDrawer component is rendering');
  const toggleDrawer = (open) => (event) => {
    console.log(`toggleDrawer called with open = ${open}`);
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      console.log('Ignoring toggleDrawer due to keydown event: ', event.key);
      return;
    }
    console.log(`Setting Drawer state to: ${open}`);
    onToggleDrawer(open);
  };
  return (
    <>
      <IconButton color="inherit" onClick={toggleDrawer(true)} edge="start">
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        {isOpen ? <DrawerContent links={links} onClose={toggleDrawer(false)} /> : null}
      </Drawer>
    </>
  );
};
