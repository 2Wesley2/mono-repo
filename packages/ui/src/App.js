import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import EmployeeManagement from './pages/EmployeeManagement';
import CustomerManagement from './pages/CustomerManagement';
import Home from './pages/Home';
import CustomerFilter from './pages/CustomerFilter';
import Checkout from './pages/Checkout';

function App() {
  const routes = [
    { path: '/', name: 'Home', element: <Home /> },
    { path: '/gerenciar-funcionarios', name: 'Gerenciar Funcionários', element: <EmployeeManagement /> },
    { path: '/gerenciar-clientes', name: 'Gerenciar Clientes', element: <CustomerManagement /> },
    { path: '/escolher-cliente', name: 'Escolher Cliente', element: <CustomerFilter /> },
    { path: '/checkout', name: 'Checkout', element: <Checkout /> },
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
