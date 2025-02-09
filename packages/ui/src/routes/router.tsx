import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/landing/landing';
import Register from '../pages/register/page';
import DashboardPage from '../pages/dashboard/Dashboard';
import { ComandaControlPage } from '../pages/ComandaControl/ComandaControl';
import ProductListPage from '../pages/products/ProductsListPage';
import EmployeeListPage from '../pages/employee/EmploeeListPage';
import ClientPage from '../pages/Clients/ClientPage';
import SettingsPage from '../pages/Settings/settings';
import FinancePage from '../pages/Finance/finance';
import LoginPage from '../pages/login/page';
import { AuthContextProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/comandas" element={<ProtectedRoute element={<ComandaControlPage />} />} />
          <Route path="/products" element={<ProtectedRoute element={<ProductListPage />} />} />
          <Route path="/employee" element={<ProtectedRoute element={<EmployeeListPage />} />} />
          <Route path="/clients" element={<ProtectedRoute element={<ClientPage />} />} />
          <Route path="/finance" element={<ProtectedRoute element={<FinancePage />} />} />
          <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
};

export default AppRouter;
