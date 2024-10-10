import React, { useState } from 'react';
import { AppBar, Container, Drawer, IconButton, List, ListItem, ListItemText, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, Link } from 'react-router-dom';

const Layout = ({ children, routes }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

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
          {routes
            .filter((route) => route.path !== location.pathname)
            .map((route, index) => (
              <ListItem button component={Link} to={route.path} key={index} onClick={() => toggleDrawer(false)}>
                <ListItemText primary={route.name} />
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
