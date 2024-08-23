'use client';
import React, { useState } from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import { NavigationDrawer } from './NavigationDrawer';
import { usePathname } from 'next/navigation';

export const DynamicNavigationLayout = ({ children, navigationLinks }) => {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerWidth = 250;
  const filteredLinks = navigationLinks.filter((link) => link.href !== pathname);

  const handleToggleDrawer = (open) => {
    console.log(`Drawer toggle requested: ${open}`);
    setIsDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <NavigationDrawer links={filteredLinks} isOpen={isDrawerOpen} onToggleDrawer={handleToggleDrawer} />
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          marginLeft: isDrawerOpen ? `${drawerWidth}px` : '0',
        }}
      >
        {children}
      </Box>
    </>
  );
};
