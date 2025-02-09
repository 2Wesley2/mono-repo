import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css'; // Ajuste o caminho para o CSS global
import AppRouter from './routes/router';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
