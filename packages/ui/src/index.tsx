import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import AppRouter from './routes/router';

document.documentElement.lang = 'pt-br';
const root = ReactDOM.createRoot(document.body! as HTMLBodyElement);

root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
