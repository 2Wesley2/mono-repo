import React from 'react';
import { Container } from '@mui/material';

const Home = ({ children }) => {
  return (
    <Container sx={{ backgroundColor: '#D3D3D3' }}>
      <div className='layout'>
        {children}
      </div>
    </Container>
  );
};

export default Home;
