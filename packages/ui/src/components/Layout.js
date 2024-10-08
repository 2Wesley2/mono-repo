import React from 'react';
import { Container } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Container
      sx={{
        backgroundColor: 'background.content',
      }}
    >
      {children}
    </Container>
  );
};

export default Layout;
