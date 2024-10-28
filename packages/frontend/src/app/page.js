"use client";
import React, { useState } from 'react';
import { AppBar, Container, Drawer, IconButton, List, ListItem, ListItemText, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Home = ({ children }) => {
  console.log('renderizado no client')
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const routes = [
    { path: '/gerenciar-funcionarios', name: 'Gerenciar Funcionários' },
    { path: '/gerenciar-clientes', name: 'Gerenciar Clientes' },
    { path: '/escolher-cliente', name: 'Escolher Cliente' },
    { path: '/checkout', name: 'Checkout' },
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

      <Container sx={{ backgroundColor: '#D3D3D3' }}>
        {children}
      </Container>
    </>
  );
};

export default Home;
