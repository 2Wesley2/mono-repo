import React, { useState } from 'react';
import { AppBar, Container, Drawer, IconButton, List, ListItem, ListItemText, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';

const Layout = ({ children, routes }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
              <NavLink
                to={route.path}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive ? 'blue' : 'inherit',
                  display: 'block', // Certifique-se de que ocupa todo o espaço do ListItem
                  width: '100%',
                })}
              >
                <ListItemText primary={route.name} />
              </NavLink>
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

export default Layout;
