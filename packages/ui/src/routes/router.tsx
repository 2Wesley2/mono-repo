// src/router.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomePage from "../pages/landing/landing"; // Página inicial
import Register from "../pages/register/page";
import DashboardPage from "../pages/dashboard/Dashboard";
import { ComandaControlPage } from "../pages/ComandaControl/ComandaControl";
import ProductListPage from "../pages/products/ProductsListPage";
import EmployeeListPage from "../pages/employee/EmploeeListPage";
import ClientPage from "../pages/Clients/ClientPage";
import SettingsPage from "../pages/Settings/settings";
import FinancePage from "../pages/Finance/finance";
import LoginPage from "../pages/login/page";

const AppRouter = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<Register />} />
				<Route path="/comandas" element={<ComandaControlPage />} />
				<Route path="/products" element={<ProductListPage />} />
				<Route path="/employee" element={<EmployeeListPage />} />
				<Route path="/clients" element={<ClientPage />} />
				<Route path="/finance" element={<FinancePage />} />
				<Route path="/settings" element={<SettingsPage />} />
			</Routes>
		</Router>
	);
};

export default AppRouter;
