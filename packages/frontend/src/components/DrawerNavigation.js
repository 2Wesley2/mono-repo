'use client'
import React, { useState } from 'react';
import { AppBar, Drawer, IconButton, List, ListItem, ListItemText, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DrawerNavigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const routes = [
    { path: '/', name: 'Home' },
    { path: '/gerenciar-funcionarios', name: 'Gerenciar Funcionários' },
    { path: '/gerenciar-clientes', name: 'Gerenciar Clientes' },
    { path: '/checkout', name: 'Vender' },
  ];

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ height: '15vh' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <List>
          {routes.map((route, index) => (
            <ListItem button key={index} onClick={() => toggleDrawer(false)}>
              <Link href={route.path} passHref legacyBehavior>
                <a
                  style={{
                    textDecoration: 'none',
                    fontWeight: pathname === route.path ? 'bold' : 'normal',
                    color: pathname === route.path ? 'blue' : 'inherit',
                    display: 'block',
                    width: '100%',
                  }}
                >
                  <ListItemText primary={route.name} />
                </a>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default DrawerNavigation;