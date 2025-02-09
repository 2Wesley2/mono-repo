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
import ProtectedRoute from './ProtectedRoute';
import { isAuthenticated } from '../lib/utils';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<DashboardPage />} isAuthenticated={isAuthenticated()} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/comandas"
          element={<ProtectedRoute element={<ComandaControlPage />} isAuthenticated={isAuthenticated()} />}
        />
        <Route
          path="/products"
          element={<ProtectedRoute element={<ProductListPage />} isAuthenticated={isAuthenticated()} />}
        />
        <Route
          path="/employee"
          element={<ProtectedRoute element={<EmployeeListPage />} isAuthenticated={isAuthenticated()} />}
        />
        <Route
          path="/clients"
          element={<ProtectedRoute element={<ClientPage />} isAuthenticated={isAuthenticated()} />}
        />
        <Route
          path="/finance"
          element={<ProtectedRoute element={<FinancePage />} isAuthenticated={isAuthenticated()} />}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute element={<SettingsPage />} isAuthenticated={isAuthenticated()} />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
