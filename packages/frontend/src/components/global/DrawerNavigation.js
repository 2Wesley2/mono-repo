'use client';
import React, { useState } from 'react';
import {
  AppBar,
  Drawer,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
} from '@mui/material';
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
    { path: '/configuration', name: 'Config' },
    { path: '/controle-de-comanda', name: 'Controle de Comanda' },
    { path: '/caixa', name: 'Caixa' },
  ];

  const filteredRoutes = routes.filter((route) => route.path !== pathname);

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const isLoginPageOrOrderPage =
    pathname === '/login' ||
    pathname === '/controle-de-comanda' ||
    pathname === '/caixa';

  if (isLoginPageOrOrderPage) return null;

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          height: '10vh',
          display: 'flex',
          backgroundColor: '#d32f2f',
          marginBottom: '1rem',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          <IconButton
            edge="start"
            aria-label="menu"
            onClick={() => toggleDrawer(true)}
            sx={{
              color: '#FFFFFF',
              mr: 2,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
          ></Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        variant="temporary"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        PaperProps={{ sx: { backgroundColor: '#d32f2f' } }}
      >
        <List>
          {filteredRoutes.map((route, index) => (
            <ListItem button key={index} onClick={() => toggleDrawer(false)}>
              <Link href={route.path} passHref legacyBehavior>
                <Button
                  fullWidth
                  variant="text"
                  size="small"
                  sx={{
                    justifyContent: 'flex-start',
                  }}
                >
                  <ListItemText
                    primary={route.name}
                    sx={{
                      color: '#FFFFFF',
                      fontSize: 'small',
                    }}
                  />
                </Button>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default DrawerNavigation;
