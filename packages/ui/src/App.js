import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import EmployeeManagement from './pages/EmployeeManagement';
import CustomerManagement from './pages/CustomerManagement';
import SalesManagement from './pages/SalesManagement';
import SaleConfirmation1 from './pages/SaleConfirmation1';
import SaleConfirmation2 from './pages/SaleConfirmation2';
import Home from './pages/Home';

function App() {
  const routes = [
    { path: '/', name: 'Home', element: <Home /> },
    { path: '/gerenciar-funcionarios', name: 'Gerenciar Funcionários', element: <EmployeeManagement /> },
    { path: '/gerenciar-clientes', name: 'Gerenciar Clientes', element: <CustomerManagement /> },
    { path: '/gerenciar-vendas', name: 'Gerenciar Vendas', element: <SalesManagement /> },
    { path: '/confirmar-venda-1', name: 'Confirmar Venda 1', element: <SaleConfirmation1 /> },
    { path: '/confirmar-venda-2', name: 'Confirmar Venda 2', element: <SaleConfirmation2 /> },
  ];

  return (
    <Router>
      <Layout routes={routes}>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
