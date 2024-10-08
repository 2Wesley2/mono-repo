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
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gerenciar-funcionarios" element={<EmployeeManagement />} />
          <Route path="/gerenciar-clientes" element={<CustomerManagement />} />
          <Route path="/gerenciar-vendas" element={<SalesManagement />} />
          <Route path="/confirmar-venda-1" element={<SaleConfirmation1 />} />
          <Route path="/confirmar-venda-2" element={<SaleConfirmation2 />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
