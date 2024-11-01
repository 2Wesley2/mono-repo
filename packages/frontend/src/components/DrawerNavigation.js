'use client'
import React, { useState } from 'react';
import {
  AppBar, Drawer, Toolbar,
  Box,
  List, ListItem, ListItemText,
  Button,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import Logo from './Logo'

const DrawerNavigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const routes = [
    { path: '/', name: 'Home' },
    { path: '/gerenciar-funcionarios', name: 'Gerenciar Funcionários' },
    { path: '/gerenciar-clientes', name: 'Gerenciar Clientes' },
    { path: '/checkout', name: 'Vender' },
  ];

  const filteredRoutes = routes.filter(route => route.path !== pathname);

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          height: '10vh',
          backgroundColor: '#E50914',
          marginBottom: '1rem'
        }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        PaperProps={{ sx: { backgroundColor: '#E50914' } }}
      >
        <List>
          {filteredRoutes.map((route, index) => (
            <ListItem
              button
              key={index}
              onClick={() => toggleDrawer(false)}
            >
              <Link href={route.path} passHref legacyBehavior>
                <Button
                  fullWidth
                  variant="text"
                  size='large'
                  disableElevation
                  disableFocusRipple
                  sx={{
                    textDecoration: 'none',
                    justifyContent: 'flex-start',
                    paddingX: 2,
                    textTransform: 'none',
                  }}
                >
                  <ListItemText
                    primary={route.name}
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontSize: 'large'
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