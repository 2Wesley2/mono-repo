'use client';
import React from 'react';
import { Container } from '@mui/material';
import { usePathname } from 'next/navigation';

const Home = ({ children }) => {
  const pathname = usePathname();
  const isOrderPage = pathname === '/controle-de-comanda';
  if (isOrderPage) return null;
  return (
    <Container sx={{ backgroundColor: '#D3D3D3' }}>
      <div className="layout">{children}</div>
    </Container>
  );
};

export default Home;
